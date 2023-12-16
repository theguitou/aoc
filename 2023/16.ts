import * as fs from "fs";
import { isArray } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

type Direction = "up"|"down"|"left"|"right";
const offsets = { up: [-1,0], down: [1,0], left: [0,-1], right: [0,1] };
const nextDirectionsByTile = {
	".": { up: "up", down: "down", left: "left", right: "right" },
	"\\": { up: "left", down: "right", left: "up", right: "down" },
	"/": { up: "right", down: "left", left: "down", right: "up" },
	"-": { up: ["right", "left"], down: ["right", "left"], left: ["right", "left"], right: ["right", "left"] },
	"|": { up: ["down", "up"], down: ["down", "up"], left: ["down", "up"], right: ["down", "up"] }
};

const map = input.split("\r\n").map(line => line.split(""));
const occupiedTiles = new Set<string>();
const alreadyEvaluatedPos = new Set<string>();

function simulate(pos: number[], direction: Direction): []
{
	const memKey = JSON.stringify([pos,direction]);
	if (alreadyEvaluatedPos.has(memKey))
	{
		return null; // stop branch
	}
	alreadyEvaluatedPos.add(memKey);

	occupiedTiles.add(JSON.stringify(pos));

	const tile = map[pos[0]][pos[1]];
	let nextDirections = nextDirectionsByTile[tile][direction];
	nextDirections = isArray(nextDirections) ? nextDirections : [nextDirections];
	const nextPos = nextDirections.map(nextDirection => {
		const offset = offsets[nextDirection];
		const nextPos = [pos[0]+offset[0], pos[1]+offset[1]];
		if (0 <= nextPos[0] && nextPos[0] < map.length && 0 <= nextPos[1] && nextPos[1] < map[0].length)
		{
			return [nextPos, nextDirection];
		}
		return null;
	});
	return nextPos.filter(pos => !!pos);
}

const p1Cases: any = [
	[0, 1, 0, 1, "right"]
];
const p2Cases: any = [
	[0, map.length, 0, 1, "right"],
	[0, map.length, map[0].length-1, map[0].length, "left"],
	[0, 1, 0, map[0].length, "down"],
	[map.length-1, map.length, 0, map[0].length, "up"]
];

for (const cases of [p1Cases, p2Cases])
{
	let max = 0;
	for (const _case of cases)
	{
		for (let i = _case[0]; i < _case[1]; i++)
		{
			for (let j = _case[2]; j < _case[3]; j++)
			{
				occupiedTiles.clear()
				alreadyEvaluatedPos.clear()
				const queue = [[[i,j], _case[4]]];
				while (queue.length > 0)
				{
					const pos: any = queue.shift();
					const nextPos = simulate(pos[0], pos[1]);
					if (nextPos !== null)
					{
						queue.push(...nextPos);
					}
				}
				max = Math.max(max, occupiedTiles.size);
			}
		}
	}
	console.log(max);
}
