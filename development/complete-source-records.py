"""Refresh evidence hashes for renamed local snapshots without network or Git."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def write(path: Path, data: object) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

def main() -> None:
    lock_path = ROOT / "development/source-lock.json"
    map_path = ROOT / "development/source-map.json"
    lock = json.loads(lock_path.read_text(encoding="utf-8"))
    mapping = json.loads(map_path.read_text(encoding="utf-8"))
    for source in lock["sources"]:
        checkout = ROOT / source["checkout"]
        if (checkout / ".git").exists():
            raise ValueError("Local snapshots must not contain repository metadata")
        source["snapshot_kind"] = "renamed-local-copy"
        report_path = ROOT / source["report"]
        report = json.loads(report_path.read_text(encoding="utf-8"))
        report["snapshot_kind"] = "renamed-local-copy"
        report["evidence_note"] = "Hashes describe edited local files; commit identifies historical origin only."
        for entry in report["inspected_files"]:
            path = checkout / entry["path"]
            entry["sha256"] = digest(path)
            if "line_count" in entry:
                entry["line_count"] = len(path.read_text(encoding="utf-8").splitlines())
        write(report_path, report)
        for row in mapping["capabilities"]:
            if row["source_repository"] != source["repository"]:
                continue
            for evidence in row["source_evidence"]:
                evidence["sha256"] = digest(checkout / evidence["path"])
                evidence.pop("url", None)
                evidence["local_path"] = (Path(source["checkout"]) / evidence["path"]).as_posix()
    lock["snapshot_note"] = "Renamed local copies; not byte-identical upstream checkouts."
    write(lock_path, lock)
    write(map_path, mapping)
    print("PASS: local snapshot evidence hashes refreshed")

if __name__ == "__main__":
    main()
