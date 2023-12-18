import * as fs from "fs";
import { extend, insertInSortedArray, isArray, memoize } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

type Action = "straight"|"right"|"left";
type Direction = "up"|"down"|"left"|"right";
const offsets = { up: [-1,0], down: [1,0], left: [0,-1], right: [0,1] };
const nextDirections = {
	"right": { "up": "right", "down": "left", "left": "up", "right": "down" },
	"left": { "up": "left", "down": "right", "left": "down", "right": "up" },
	"straight": { "up": "up", "down": "down", "left": "left", "right": "right" }
};

const map = input.split("\r\n").map(line => line.split("").map(n => +n));
const goal = [map.length-1, map[0].length-1];

function drawPath(path: number[][])
{
	const canvas = extend([], map);
	for (const p of path)
	{
		canvas[p[0]][p[1]] = "#";
	}
	console.log(canvas.map(line => line.join("")).join("\n"));
	console.log("----------------");
}

function findNextMoves(pos: number[], direction: Direction, nbStraightSteps: number, p2: boolean): any[][]
{
	let actions: Action[];
	if (!p2)
	{
		actions = nbStraightSteps === 3 ? ["left", "right"] : ["left", "right", "straight"];
	}
	else
	{
		actions = nbStraightSteps < 4 ? ["straight"] : (nbStraightSteps < 10 ? ["left", "right", "straight"] : ["left", "right"]);

	}
	const nextMoves: any = actions.map(action => {
		const nextDirection = nextDirections[action][direction] as Direction;
		const nextOffset = offsets[nextDirection];
		const nextPos = [pos[0]+nextOffset[0], pos[1]+nextOffset[1]];
		if (0 <= nextPos[0] && nextPos[0] < map.length && 0 <= nextPos[1] && nextPos[1] < map[0].length)
		{
			const nextNbStraightSteps = direction === nextDirection ? (nbStraightSteps+1) : 1;
			return [nextPos, nextDirection, nextNbStraightSteps];
		}
	});
	return nextMoves.filter(move => !!move);
}

// BFS with sorted queue by the heatLoss. To be sure to get the shortest path
for (const p2 of [false, true])
{
	const sortedQueue: any = [[0, [0,0], "right", 0, [[0,0]]]];
	const visited = new Map<string, any>();
	while (sortedQueue.length > 0)
	{
		const [heatLoss, pos, direction, nbStraightSteps, path] = sortedQueue.shift();
	
		if (pos[0] === goal[0] && pos[1] === goal[1] && (!p2 || nbStraightSteps >= 4))
		{
			console.log(heatLoss);
			break;
		}
	
		const memKey = JSON.stringify([pos, direction, nbStraightSteps]);
		if (visited.has(memKey))
		{
			continue;
		}
		visited.set(memKey, [heatLoss, path]);
	
		for (const nextMove of findNextMoves(pos, direction, nbStraightSteps, p2))
		{
			const block = map[nextMove[0][0]][nextMove[0][1]];
			const newPath = path.concat([[nextMove[0][0],nextMove[0][1]]]);
			insertInSortedArray(sortedQueue, [heatLoss+block].concat(nextMove).concat([newPath]), (a,b) => a[0]-b[0]);
		}
	}
}
