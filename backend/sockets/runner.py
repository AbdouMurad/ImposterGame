import json
import tempfile
import os
import subprocess

"""
Setup test code and expected output/input. Create a temp directory and solution.py file which contains the code
"""


class Engine:
    def __init__(self, sourceCode, tests):
        self.sourceCode = sourceCode
        self.tests = tests
    
    def runTests(self):
        tmpdir = tempfile.TemporaryDirectory()
        solution_path = os.path.join(tmpdir.name, "solution.py")



payload = {
    "code" : 
"""
def solve(x):
    return x + 10
""",
    "tests" : [
        { 'input': -10, 'expected': 0},
        { 'input': 5, 'expected': 15},
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