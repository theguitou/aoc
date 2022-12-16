import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const valves = input.split("\n")
	.map(line => {
		const m = line.match(/Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/);
		return {
			name: m[1],
			rate: +m[2],
			valves: m[3].split(", ")
		}
	});

function nameToIdx(name) {
	return valves.findIndex(v => v.name === name);
}

// Shortest distances between valves (Floyd-Warshall)
const distances = Array.apply(null, Array(valves.length))
	.map(() => Array.apply(null, Array(valves.length))
		.map(() => Infinity));

valves.forEach((valve, i) => {
	for (let connectedValve of valve.valves) {
		distances[i][nameToIdx(connectedValve)] = 1;
	}
});

for (let k = 0; k < valves.length; k++) {
	for (let i = 0; i < valves.length; i++) {
		for (let j = 0; j < valves.length; j++) {
			distances[i][j] = Math.min(distances[i][j], distances[i][k] + distances[k][j]);
		}
	}
}

function findMaxPressureAlone(valvesOpened: Set<number>, valvesToOpen: Set<number>, currentValveIdx, minutesLeft, currentPressure, maxPressure, depth) {
	return findMaxPressureWithElephant(valvesOpened, valvesToOpen, currentValveIdx, 0, minutesLeft, 0, currentPressure, maxPressure, depth);
}

function findMaxPressureWithElephant(valvesOpened: Set<number>, valvesToOpen: Set<number>, currentMeValveIdx, currentElephantValveIdx, minutesLeftMe, minutesLeftElephant, currentPressure, maxPressure, depth) {
	const currentMeValve = valves[currentMeValveIdx];
	const currentElephantValve = valves[currentElephantValveIdx];

	if (minutesLeftMe > 0 && currentMeValve.rate > 0 && !valvesOpened.has(currentMeValveIdx)) {
		minutesLeftMe--;
		currentPressure += currentMeValve.rate * minutesLeftMe;
		valvesOpened.add(currentMeValveIdx);
	}
	if (minutesLeftElephant > 0 && currentElephantValve.rate > 0 && !valvesOpened.has(currentElephantValveIdx)) {
		minutesLeftElephant--;
		currentPressure += currentElephantValve.rate * minutesLeftElephant;
		valvesOpened.add(currentElephantValveIdx);
	}

	if (minutesLeftMe > minutesLeftElephant) {
		for (let valveToOpenIdx of valvesToOpen) {
			// suffisant time to move + 1min to open ?
			const timeToMove = distances[currentMeValveIdx][valveToOpenIdx];
			if (timeToMove < minutesLeftMe) {
				let nextValvesOpened = new Set(valvesOpened);
				let nextValvesToOpen = new Set(valvesToOpen);
				nextValvesToOpen.delete(valveToOpenIdx);
				maxPressure = Math.max(maxPressure, findMaxPressureWithElephant(nextValvesOpened, nextValvesToOpen, valveToOpenIdx, currentElephantValveIdx, minutesLeftMe-timeToMove, minutesLeftElephant, currentPressure, maxPressure, depth+1));
			}
		}
	}
	else {
		for (let valveToOpenIdx of valvesToOpen) {
			// suffisant time to move + 1min to open ?
			const timeToMove = distances[currentElephantValveIdx][valveToOpenIdx];
			if (timeToMove < minutesLeftElephant) {
				let nextValvesOpened = new Set(valvesOpened);
				let nextValvesToOpen = new Set(valvesToOpen);
				nextValvesToOpen.delete(valveToOpenIdx);
				maxPressure = Math.max(maxPressure, findMaxPressureWithElephant(nextValvesOpened, nextValvesToOpen, currentMeValveIdx, valveToOpenIdx, minutesLeftMe, minutesLeftElephant-timeToMove, currentPressure, maxPressure, depth+1));
			}
		}
	}
	return Math.max(maxPressure, currentPressure);
}

for (let part of [1, 2]) {
	let valvesOpened = new Set<number>();
	let valvesToOpen = new Set<number>();
	for (let i = 0; i < valves.length; i++) {
		if (valves[i].rate > 0) {
			valvesToOpen.add(i);
		}
	}
	
	const startIdx = nameToIdx("AA");
	valvesToOpen.delete(startIdx);

	let result;
	if (part === 1)
		result = findMaxPressureAlone(valvesOpened, valvesToOpen, startIdx, 30, 0, 0, 0);
	else
		result = findMaxPressureWithElephant(valvesOpened, valvesToOpen, startIdx, startIdx, 26, 26, 0, 0, 0);
	console.log(`part: ${part}, result: ${result}`);
}
