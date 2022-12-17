import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const dirs = input.split("");
let dirCursor = 0;

let cave = new Set();
let caveHeight = 0;
const rocks = [
	[[1,1,1,1]],
	[[0,1,0],[1,1,1],[0,1,0]],
	[[1,1,1],[0,0,1],[0,0,1]],
	[[1],[1],[1],[1]],
	[[1,1],[1,1]]
];

function isCollide(rock, falling): "none"|"continue"|"stop" {
	// cave (left/right)
	if (!falling) {
		for (let l of rock) {
			if ((l[0] !== -1 && l[0][0] < 0) || (l[l.length-1] !== -1 && l[l.length-1][0] >= 7)) {
				return "continue";
			}
		}
	}
	// below height?
	let checkOtherRocks = false;
	for (let c of rock[0]) {
		if (c !== -1 && c[1] < 0) {
			return "stop";
		}
		if (c !== -1 && c[1] < caveHeight) {
			checkOtherRocks = true;
			break;
		}
	}
	if (checkOtherRocks) {
		for (let l of rock) {
			for (let c of l) {
				if (c === -1 || c[1] >= caveHeight) {
					continue;
				}
				const coords = `${c[0]};${c[1]}`;
				if (cave.has(coords)) {
					return falling ? "stop" : "continue";
				}
			}
		}
	}
	return "none";
}

function sealRock(rock) {
	for (let l of rock) {
		for (let c of l) {
			if (c !== -1) {
				caveHeight = Math.max(caveHeight, c[1]+1);
				const coords = `${c[0]};${c[1]}`;
				cave.add(coords);
			}
		}
	}
}

const patternHeight = 50;

function getRockPattern(r, dir) {
	const pattern = [r,dir];
	for (let i = caveHeight-patternHeight; i < caveHeight; i++) {
		for (let j = 0; j < 7; j++) {
			const coords = `${j};${i}`;
			pattern.push(cave.has(coords) ? 1 : 0);
		}
	}
	return JSON.stringify(pattern);
}

function repeatRockPattern(pattern, patternState, r) {
	pattern = JSON.parse(pattern);
	pattern.shift();pattern.shift();

	const nbRocks = r - patternState[0];
	const nbLoops = Math.floor((1000000000000-r) / nbRocks);
	r += nbLoops * nbRocks;
	caveHeight += nbLoops * (caveHeight - patternState[1]);
	cave = new Set();
	for (let i = caveHeight-patternHeight; i < caveHeight; i++) {
		for (let j = 0; j < 7; j++) {
			if (pattern.shift()) {
				const coords = `${j};${i}`;
				cave.add(coords);
			}
		}
	}
	return r;
}

const nbRocks = rocks.length;
const nbDirs = dirs.length;
const stateByPattern = new Map<string, any>();

for (let r = 0; r < 1000000000000;) {
	const rockCursorMod = (r++)%nbRocks;
	let rock = rocks[rockCursorMod]
		.map((l, i) => l
			.map((c, j) => c === 0 ? -1 : [2+j,caveHeight+3+i]));

	while (true) { /// SIMULATION
		// moving left/right
		const dirCursorMod = (dirCursor++)%nbDirs;
		const dirFactor = dirs[dirCursorMod] === ">" ? 1 : -1;
		let nextMoveRock = rock
				.map(l => l
					.map(c => c === -1 ? -1 : [c[0]+dirFactor,c[1]]));

		if (isCollide(nextMoveRock, false) === "continue") {
			nextMoveRock = rock; // don't translate on side
		}

		// falling
		let nextFallRock = nextMoveRock
				.map(l => l
					.map(c => c === -1 ? -1 : [c[0],c[1]-1]));

		if (isCollide(nextFallRock, true) === "stop") {
			sealRock(nextMoveRock);

			if (r > 2022) {
				const pattern = getRockPattern(rockCursorMod, dirCursorMod);
				const stateForPattern = stateByPattern.get(pattern);
				if (stateForPattern) {
					r = repeatRockPattern(pattern, stateForPattern, r-1)+1;
				}
				else {
					stateByPattern.set(pattern, [r-1,caveHeight]);
				}
			}
			else if (r === 2022) {
				console.log(`part 1, result: ${caveHeight}`);
			}
			break;
		}
		rock = nextFallRock;
	}
}

console.log(`part 2, result: ${caveHeight}`);