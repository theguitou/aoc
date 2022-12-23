import * as fs from "fs";
import { SuperMap } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const dirs = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];

const elvesByPosition = new SuperMap<number[], number>();
const elvePositions: number[][] = [];

input.split("\n")
	.forEach((line, j) => line.split("")
		.forEach((c, i) => {
			if (c === "#") {
				elvePositions.push([i,j]);
				elvesByPosition.set([i,j], elvePositions.length);
			}
		}));

const isFree = (position, checkDirs, elvesByPosition) => !checkDirs.find(dir => elvesByPosition.has([position[0]+dir[0],position[1]+dir[1]]));

const moveDirsByRound = [[0,-1],[0,1],[-1,0],[1,0]];
const moveCheckDirsByRound = [
	[[0,-1],[1,-1],[-1,-1]],
	[[0,1],[1,1],[-1,1]],
	[[-1,0],[-1,-1],[-1,1]],
	[[1,0],[1,-1],[1,1]]
];

let round = 0;
while (true) {
	let isolatedElvesCount = 0;
	const newElvesByPosition = new SuperMap<number[], number>();
	for (let i in elvePositions) {
		const position = elvePositions[+i];
		// check all directions
		if (isFree(position, dirs, elvesByPosition)) {
			isolatedElvesCount++;
			continue;
		}
		// check in move direction
		for (let n = 0; n < 4; n++) {
			let dirRound = (round + n)%4;
			if (isFree(position, moveCheckDirsByRound[dirRound], elvesByPosition)) {
				const moveDir = moveDirsByRound[dirRound];
				const newPosition = [position[0]+moveDir[0],position[1]+moveDir[1]];
				if (!newElvesByPosition.has(newPosition)) {
					newElvesByPosition.set(newPosition, +i);
				}
				else {
					newElvesByPosition.delete(newPosition);
				}
				break;
			}
		}
	}
	
	// update positions
	for (let [position, i] of newElvesByPosition) {
		const prevPosition = elvePositions[i];
		elvesByPosition.delete(prevPosition);
		elvePositions[i] = position;
		elvesByPosition.set(position, i);
	}

	round++;

	if (round === 10) {
		let limits = [Infinity,Infinity,-Infinity,-Infinity]; //left,up,right,down
		for (let position of elvePositions) {
			limits[0] = Math.min(limits[0], position[0]);
			limits[2] = Math.max(limits[2], position[0]);
			limits[1] = Math.min(limits[1], position[1]);
			limits[3] = Math.max(limits[3], position[1]);
		}

		const emptyCells = (limits[2]-limits[0]+1) * (limits[3]-limits[1]+1) - elvePositions.length;
		console.log(`part 1, nb: ${emptyCells}`);
	}

	if (isolatedElvesCount === elvePositions.length) {
		console.log(`part 2, round: ${round}`);
		break;
	}
}
