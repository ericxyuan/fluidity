"""Validate release closure and maintenance provenance using Python stdlib only."""
from __future__ import annotations
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition: errors.append(message)

def runtime_errors(plugin: Path) -> list[str]:
    errors: list[str] = []
    manifest = plugin / ".codex-plugin/plugin.json"
    if not manifest.is_file(): return [f"Missing manifest: {manifest}"]
    data = json.loads(manifest.read_text(encoding="utf-8"))
    require(data.get("name") == "fluidity", "Manifest identifier must be fluidity", errors)
    require(bool(re.fullmatch(r"\d+\.\d+\.\d+(?:[+-][\w.+-]+)?", data.get("version", ""))), "Invalid version", errors)
    require(data.get("skills") == "./skills/", "Invalid skill discovery path", errors)
    for name in ("fluidity-core", "fluidity-motion", "fluidity-components", "fluidity-review"):
        entry = plugin / "skills" / name / "SKILL.md"
        require(entry.is_file(), f"Missing skill: {name}", errors)
        if entry.is_file():
            body = entry.read_text(encoding="utf-8")
            require(body.startswith("---\n") and f"name: {name}\n" in body and "description: " in body,
                    f"Missing frontmatter: {entry}", errors)
    for expected in ("LICENSE", "README.md"):
        require((plugin/expected).is_file(), f"Missing release file: {expected}", errors)
    root = plugin.resolve()
    for path in sorted(plugin.rglob("*")):
        if not path.is_file(): continue
        rel=path.relative_to(plugin).as_posix()
        require(not set(path.relative_to(plugin).parts).intersection({"node_modules", ".sources", ".git", ".validation", "__pycache__"}),
                f"Development/cache file in release: {rel}", errors)
        if path.suffix not in {".md", ".ts", ".tsx", ".css", ".json"}: continue
        content=path.read_text(encoding="utf-8")
        require("[TODO:" not in content, f"Unfinished scaffold: {rel}", errors)
        if path.suffix == ".md":
            # Code examples can use illustrative imports/links. Operational
            # Markdown links outside code blocks must all remain in the archive.
            prose=re.sub(r"(?ms)^```.*?^```[^\n]*", "", content)
            for match in re.finditer(r"\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)", prose):
                target=match.group(1).strip("<>")
                if target.startswith("#") or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:",target): continue
                dest=(path.parent/unquote(target.split("#",1)[0])).resolve()
                require(dest.is_relative_to(root), f"Link escapes plugin: {rel} -> {target}",errors)
                require(dest.exists(), f"Broken local link: {rel} -> {target}", errors)
        if path.suffix in {".ts", ".tsx", ".css"}:
            for match in re.finditer(r"(?:from\s+|import\s*\(?\s*|@import\s*)['\"]([^'\"]+)['\"]", content):
                dep=match.group(1)
                if dep.startswith("."):
                    base=(path.parent/dep).resolve()
                    possibilities=[base]+[Path(str(base)+ext) for ext in (".ts", ".tsx", ".css")]+[base/"index.ts", base/"index.tsx"]
                    require(base.is_relative_to(root) and any(p.is_file() for p in possibilities),
                            f"Unresolved/off-package import: {rel} -> {dep}", errors)
                else:
                    require(dep in {"react", "react/jsx-runtime", "motion/react"},
                            f"Undeclared consumer dependency: {rel} -> {dep}", errors)
            require(not re.search(r"https?://|\.sources[/\\]|(?:fetch|XMLHttpRequest|WebSocket)\s*\(",
                    re.sub(r"(?m)^\s*//.*$", "", content)), f"Unexpected network/source access in runtime code: {rel}", errors)
    return errors

def provenance_errors(check_sources: bool) -> list[str]:
    errors: list[str] = []
    lock=json.loads((ROOT/"development/source-lock.json").read_text(encoding="utf-8"))
    mapping=json.loads((ROOT/"development/source-map.json").read_text(encoding="utf-8"))
    sources={s["repository"]:s for s in lock["sources"]}
    require(len(sources)==4, "Exactly four local source snapshots must be recorded", errors)
    rows=mapping["capabilities"]
    require(len({r["id"] for r in rows})==len(rows), "Duplicate mapping IDs", errors)
    require({r["source_repository"] for r in rows}==set(sources), "Source coverage incomplete", errors)
    for source in sources.values():
        require(bool(re.fullmatch(r"[a-f0-9]{40}",source["commit"])), "Source must use full commit SHA", errors)
        report=json.loads((ROOT/source["report"]).read_text(encoding="utf-8"))
        require(report["commit"]==source["commit"], f"Report commit drift: {source['id']}", errors)
        if check_sources:
            checkout=ROOT/source["checkout"]
            require(source.get("snapshot_kind") == "renamed-local-copy", f"Unclassified snapshot: {source['id']}", errors)
            require(not (checkout/".git").exists(), f"Repository metadata in local snapshot: {source['id']}", errors)
            for entry in report["inspected_files"]:
                path=checkout/entry["path"]
                require(path.is_file(), f"Missing inspected file: {path}", errors)
                if path.is_file() and "sha256" in entry:
                    require(sha(path)==entry["sha256"], f"Inspected hash drift: {path}", errors)
    for row in rows:
        required={"capability","source_files","original_name","retained","generalized","modified","rejected","outputs","commit","source_evidence"}
        require(required.issubset(row), f"Incomplete source map row: {row['id']}", errors)
        require(row["classification"] in {"CORE","SPECIALIZED","REFERENCE","REJECT"}, f"Unknown tier: {row['id']}", errors)
        source=sources[row["source_repository"]]
        require(row["commit"]==source["commit"], f"Mapping revision drift: {row['id']}", errors)
        for target in row["outputs"]: require((ROOT/target).is_file(), f"Missing mapped output: {target}", errors)
        for evidence in row["source_evidence"]:
            require(evidence["path"] in row["source_files"], f"Evidence mismatch: {row['id']}", errors)
            if check_sources:
                require(sha(ROOT/source["checkout"]/evidence["path"])==evidence["sha256"], f"Source hash drift: {row['id']}", errors)
    return errors

def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plugin",type=Path,default=ROOT/"fluidity")
    parser.add_argument("--runtime-only",action="store_true",help="Validate an extracted plugin without any development/source files")
    parser.add_argument("--sources",action="store_true",help="Also verify renamed local snapshot files and evidence hashes")
    args=parser.parse_args()
    errors=runtime_errors(args.plugin)
    if not args.runtime_only: errors+=provenance_errors(args.sources)
    if errors:
        for error in errors: print(f"FAIL: {error}")
        raise SystemExit(1)
    print("PASS: plugin closure, four skills, local links/imports" + (" and local snapshot evidence" if not args.runtime_only else " (standalone archive)"))

if __name__=="__main__": main()
