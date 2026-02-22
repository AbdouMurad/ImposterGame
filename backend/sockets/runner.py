import json
import tempfile
import os
import subprocess
import sys

"""
Setup test code and expected output/input. Create a temp directory and solution.py file which contains the code
"""


class Engine:
    def __init__(self, sourceCode, tests):
        self.sourceCode = sourceCode
        self.tests = tests
    
    def runTests(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            solution_path = os.path.join(tmpdir, "solution.py")

            with open(solution_path, "w") as f:
                f.write(self.sourceCode)

            runner_code = f"""
    import json
    import solution

    tests = {json.dumps(self.tests)}

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
            runner_path = os.path.join(tmpdir, "runner.py")

            with open(runner_path, "w") as f:
                f.write(runner_code)

            result = subprocess.run(
                [sys.executable, "runner.py"],
                cwd=tmpdir,
                capture_output=True,
                text=True,
                timeout=2
            )

            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            return result