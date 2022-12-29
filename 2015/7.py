from collections import deque
import re

with open("input.txt") as file:
	data = file.read().strip()

def parseInput(nums, operations):
	for line in data.split("\n"):
		m = re.findall("(?:(?:(\w+) )?(OR|AND|NOT|RSHIFT|LSHIFT) )?(\w+) -> (\w+)", line)[0]
		if m[0] == "" and m[1] == "" and m[2].isnumeric():
			nums[m[3]] = int(m[2])
		else:
			operations.append(m)

def makeOperation(left, operator, right):
	if operator == "OR":
		return left | right
	elif operator == "AND":
		return left & right
	elif operator == "NOT":
		return ~right
	elif operator == "RSHIFT":
		return left >> right
	elif operator == "LSHIFT":
		return left << right
	else:
		return right

def solve(value_b):
	nums = {}
	operations = deque()
	parseInput(nums, operations)
	if not value_b is None:
		nums["b"] = value_b
	while not "a" in nums and len(operations) > 0:
		operation = operations.popleft()
		if operation[0].isnumeric():
			left = int(operation[0])
		elif operation[0] in nums:
			left = nums[operation[0]]
		else:
			left = None
		if operation[2].isnumeric():
			right = int(operation[2])
		elif operation[2] in nums:
			right = nums[operation[2]]
		else:
			right = None
		if (operation[0] == "" or left != None) and right != None:
			num = makeOperation(left, operation[1], right)
			nums[operation[3]] = num
		else:
			operations.append(operation)
	return nums["a"]

value_a = solve(None)
print(f"part 1, a: {value_a}")

value_a = solve(value_a)
print(f"part 2, a: {value_a}")