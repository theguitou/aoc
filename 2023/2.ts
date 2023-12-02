import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const expectedConfig = { red: 12, green: 13, blue: 14 }

const games = [];
for (const line of input.split("\n"))
{
	const sets = games[games.length] = [];
	for (const rawSet of line.split(":")[1].split(";"))
	{
		const set = {};
		const allMatches = rawSet.matchAll(/(\d+) (green|red|blue)/g);
		for (const match of allMatches)
		{
			set[match[2]] = +match[1];
		}
		sets.push(set);
	}
}

function isPossibleGame(game)
{
	for (const set of game)
	{
		const gameConfig = { red: 0, green: 0, blue: 0 };
		Object.keys(expectedConfig).forEach(color => gameConfig[color] = gameConfig[color] + (set[color] || 0));
		if (!Object.keys(expectedConfig).every(color => expectedConfig[color] >= gameConfig[color]))
		{
			return false;
		}
	}
	return true
}

function getPower(game)
{
	const gameConfig = { red: 0, green: 0, blue: 0 };
	for (const set of game)
	{
		Object.keys(expectedConfig).forEach(color => gameConfig[color] = Math.max(gameConfig[color], (set[color] || 0)));
	}
	return Object.keys(expectedConfig).reduce((r,color) => r * gameConfig[color], 1);
}

let sums = [0,0];
for (let i = 0; i < games.length; i++)
{
	if (isPossibleGame(games[i]))
	{
		sums[0] += i+1;
	}

	sums[1] += getPower(games[i]);
}
console.log(sums);
