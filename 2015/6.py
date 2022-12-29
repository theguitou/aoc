import re

with open("input.txt") as file:
	data = file.read().strip()

actions = []
for line in data.split("\n"):
	m = re.findall("(turn off|turn on|toggle) (\d+),(\d+) through (\d+),(\d+)", line)
	actions.append(m[0])

grid = [[0 for _ in range(1000)] for _ in range(1000)]
turnedOnCount = 0
for action in actions:
	for i in range(int(action[1]),int(action[3])+1):
		for j in range(int(action[2]),int(action[4])+1):
			prevState = grid[i][j]
			if action[0] == "turn off":
				state = 0
			elif action[0] == "turn on":
				state = 1
			else:
				state = not prevState
			if state != prevState:
				grid[i][j] = state
				turnedOnCount += 1 if state else -1

print(f"part 1, turnedOnCount: {turnedOnCount}")

grid = [[0 for _ in range(1000)] for _ in range(1000)]
totalBrightness = 0
for action in actions:
	for i in range(int(action[1]),int(action[3])+1):
		for j in range(int(action[2]),int(action[4])+1):
			prevBrightness = grid[i][j]
			if action[0] == "turn off":
				brightness = -1
			elif action[0] == "turn on":
				brightness = 1
			else:
				brightness = 2
			grid[i][j] = max(0, prevBrightness+brightness)
			totalBrightness += grid[i][j]-prevBrightness

print(f"part 2, totalBrightness: {totalBrightness}")
