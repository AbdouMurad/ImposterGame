import json
import tempfile
import os
import subprocess
import sys

class Engine:
    def __init__(self, sourceCode, tests, funcName):
        self.sourceCode = sourceCode
        self.tests = tests
        self.funcName = funcName

    def runTests(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            solution_path = os.path.join(tmpdir, "solution.py")

            with open(solution_path, "w") as f:
                f.write(self.sourceCode)

            runner_code = f"""
import json
import solution

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(nodes):
    if not nodes:
        return None
    root = TreeNode(nodes[0])
    queue = [root]
    i = 1
    while queue and i < len(nodes):
        node = queue.pop(0)
        if i < len(nodes) and nodes[i] is not None:
            node.left = TreeNode(nodes[i])
            queue.append(node.left)
        i += 1
        if i < len(nodes) and nodes[i] is not None:
            node.right = TreeNode(nodes[i])
            queue.append(node.right)
        i += 1
    return root

TREE_FUNCS = {{"isValidBST", "diameterOfBinaryTree", "isBalanced"}}
FUNC_NAME = "{self.funcName}"

tests = {json.dumps(self.tests)}
results = []

func = getattr(solution, FUNC_NAME)

for t in tests:
    try:
        args = dict(t["input"])
        if FUNC_NAME in TREE_FUNCS and "root" in args:
            args["root"] = build_tree(args["root"])
        output = func(**args)
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
                timeout=5
            )

            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            return result