import json
import tempfile
import os
import subprocess

"""
Setup test code and expected output/input. Create a temp directory and solution.py file which contains the code
"""

payload = {
    "code" : 
"""
def solve(x):
    return x[0] + x[1]
""",
    "tests" : [
        { 'input': [1,2], 'expected': 3},
        { 'input': [3,2], 'expected': 5},
    ]
}

#make temp directory and solution.py file in it
tmpdir = tempfile.TemporaryDirectory()
solution_path = os.path.join(tmpdir.name, "solution.py")

with open(solution_path, "w") as f:
    f.write(payload["code"])


runner_code = f"""
import json
import solution

tests = {json.dumps(payload["tests"])}

results = []

for t in tests:
    try:
        output = solution.solve(t["input"])
        results.append({{
            "input": t["input"],
            "expected": t["expected"],
            "output": output,
            "passed": output == t["expected"]
        }})
    except Exception as e:
        results.append({{
            "input": t["input"],
            "error": str(e),
            "passed": False
        }})

print(json.dumps(results))
"""

runner_path = os.path.join(tmpdir.name, "runner.py")

with open(runner_path, "w") as f:
    f.write(runner_code)


result = subprocess.run(
    ["python", "runner.py"],
    cwd=tmpdir.name,
    capture_output=True,
    text=True,
    timeout=2              # prevents infinite loops
)


print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)