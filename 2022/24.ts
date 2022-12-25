import * as fs from "fs";
import { SuperMap } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

// let bounds = [6,4];
let bounds = [120,25];
let map = new SuperMap<number[], Set<number>>();
const winds: any[][] = [];
input.split("\n").forEach((line, j) => {
	line.split("").forEach((c, i) => {
		if (c === "<" || c === ">" || c === "^" || c === "v") {
			const set = new Set<number>();
			set.add(winds.length);
			map.set([i,j], set);
			winds.push([c,[i,j]]);
		}
	});
});

function copyMap(src) {
	const dest = new SuperMap<number[], Set<number>>();
	for (let [key, set] of src) {
		dest.set(key, new Set<number>(set));
	}
	return dest;
}

function copyWinds(src) {
	const dest = [];
	for (let wind of src) {
		dest.push([...wind]);
	}
	return dest;
}

function simulateWinds(winds, map) {
	winds.forEach(([c, pos], n) => {
		let newPos = [...pos];
		if (c === "<") {
			if (pos[0] === 1) {
				newPos[0] = bounds[0];
			}
			else {
				newPos[0] -= 1;
			}
		}
		else if (c === ">") {
			if (pos[0] === bounds[0]) {
				newPos[0] = 1;
			}
			else {
				newPos[0] += 1;
			}
		}
		else if (c === "^") {
			if (pos[1] === 1) {
				newPos[1] = bounds[1];
			}
			else {
				newPos[1] -= 1;
			}
		}
		else {
			if (pos[1] === bounds[1]) {
				newPos[1] = 1;
			}
			else {
				newPos[1] += 1;
			}
		}
		winds[n] = [c, newPos];
		let set = map.get(pos);
		set.delete(n);
		set = map.get(newPos) || new Set();
		set.add(n);
		map.set(newPos, set);
	});
}

function getPlayerChoices(player, map, goal) {
	const choice = [];
	for (let move of [[0,0],[-1,0],[1,0],[0,-1],[0,1]]) {
		const nextPlayer = [player[0]+move[0],player[1]+move[1]];
		if (nextPlayer[0] === goal[0] && nextPlayer[1] === goal[1]) {
			return [nextPlayer];
		}
		if ((0 < nextPlayer[0] && nextPlayer[0] <= bounds[0] && 0 < nextPlayer[1] && nextPlayer[1] <= bounds[1]) ||
		 	(nextPlayer[0] === start[0] && nextPlayer[1] === start[1])) {
			const set = map.get(nextPlayer);
			if (!set || set.size === 0) {
				choice.push(nextPlayer);
			}
		}
	}
	return choice;
}

const start = [1,0];
const end = [bounds[0],bounds[1]+1];
const windsByMinute = [[winds, map]];

function moveToGoal(player, goal, minutes) {
	const uniqueQueue = new Set();
	const queue: any[] = [[player, minutes]];
	while (queue.length > 0) {
		const [player, minutes] = queue.shift();
	
		let windsForNextMinute = windsByMinute[(minutes+1)%600];
		if (!windsForNextMinute) {
			let windsForMinute = windsByMinute[minutes%600];
			windsForNextMinute = [copyWinds(windsForMinute[0]), copyMap(windsForMinute[1])];
			windsByMinute[(minutes+1)%600] = windsForNextMinute;
			simulateWinds(windsForNextMinute[0], windsForNextMinute[1]);
		}
	
		const choices = getPlayerChoices(player, windsForNextMinute[1], goal);
		for (let choice of choices) {
			if (choice[0] === goal[0] && choice[1] === goal[1]) {
				return minutes+1;
			}
			const print = JSON.stringify([choice, minutes+1]);
			if (!uniqueQueue.has(print)) {
				uniqueQueue.add(print);
				queue.push([choice, minutes+1]);
			}
		}
	}
	return null;
}

let minutes = moveToGoal(start, end, 0);
console.log(`part 1, length: ${minutes}`);

minutes = moveToGoal(end, start, minutes);
minutes = moveToGoal(start, end, minutes);

console.log(`part 2, length: ${minutes}`);
