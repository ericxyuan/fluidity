"""Check that release validation detects broken offline dependencies and required files."""
from pathlib import Path
import shutil
import tempfile
from validate import ROOT, runtime_errors

with tempfile.TemporaryDirectory(prefix="fluidity-closure-test-") as temporary:
    plugin=Path(temporary)/"fluidity"
    shutil.copytree(ROOT/"fluidity",plugin)
    assert not runtime_errors(plugin), "Healthy isolated plugin should validate"
    required_file=plugin/"README.md"
    required_file.unlink()
    assert any("Missing release file" in e for e in runtime_errors(plugin)), "Missing README must fail"
    shutil.copy2(ROOT/"fluidity/README.md",required_file)
    helper=plugin/"skills/fluidity-components/assets/extensions/stack-model.ts"
    helper.unlink()
    assert any("Unresolved/off-package import" in e for e in runtime_errors(plugin)), "Missing local helper must fail"
    shutil.copy2(ROOT/"fluidity/skills/fluidity-components/assets/extensions/stack-model.ts",helper)
    helper.write_text(helper.read_text(encoding="utf-8")+'\nimport "https://github.com/example/runtime.js";\n',encoding="utf-8")
    assert any("Undeclared consumer dependency" in e for e in runtime_errors(plugin)), "Remote source dependency must fail"
print("PASS: isolated plugin validation detects missing required files, missing helpers and remote code dependencies")
