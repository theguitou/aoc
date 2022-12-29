with open("input.txt") as file:
	data = file.read().strip()

moves = {"^":(0,-1),">":(1,0),"<":(-1,0),"v":(0,1)}
for part in [1,2]:
	houses = set()
	houses.add((0,0))
	players = [(0,0),(0,0)]
	for (turn, move) in zip(range(len(data)), [moves[x] for x in list(data)]):
		playerId = 0 if part == 1 else turn%2
		player = players[playerId]
		player = (player[0]+move[0],player[1]+move[1])
		players[playerId] = player
		houses.add(player)
	print(f"part {part}, houses: {len(houses)}")
