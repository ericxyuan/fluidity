"""Create and independently validate a self-contained Fluidity archive."""
from __future__ import annotations
import hashlib
import json
import tempfile
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
from validate import ROOT, provenance_errors, runtime_errors

def main() -> None:
    plugin=ROOT/"fluidity"
    errors=runtime_errors(plugin)+provenance_errors(False)
    if errors: raise SystemExit("\n".join(errors))
    version=json.loads((plugin/".codex-plugin/plugin.json").read_text(encoding="utf-8"))["version"]
    output=ROOT/"dist"
    output.mkdir(exist_ok=True)
    archive=output/f"fluidity-{version}.zip"
    files=sorted(p for p in plugin.rglob("*") if p.is_file())
    with ZipFile(archive,"w",ZIP_DEFLATED,compresslevel=9) as bundle:
        for path in files: bundle.write(path,path.relative_to(plugin).as_posix())
    # The temporary extraction has no parent workspace, source clones, node_modules
    # or research reports. Runtime links/imports must still resolve.
    with tempfile.TemporaryDirectory(prefix="fluidity-release-") as temp:
        extracted=Path(temp)/"fluidity"
        with ZipFile(archive) as bundle: bundle.extractall(extracted)
        errors=runtime_errors(extracted)
        if errors: raise SystemExit("\n".join(errors))
    evidence={"archive":archive.relative_to(ROOT).as_posix(),"version":version,
        "sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),
        "file_count":len(files),"standalone_validation":"passed",
        "files":[{"path":p.relative_to(plugin).as_posix(),"sha256":hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}
    (output/"release-manifest.json").write_text(json.dumps(evidence,indent=2)+"\n",encoding="utf-8")
    print(f"PASS: {archive} ({len(files)} files); standalone extraction validated")
    print(f"SHA256: {evidence['sha256']}")

if __name__=="__main__": main()
