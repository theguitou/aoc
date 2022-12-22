import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

// coords <-> . ou #
const map = {};
let moves = [];
input.split("\n\n")
	.forEach((block, i) => {
		if (i === 0) {
			block.split("\n")
				.forEach((line, i) => line.split("")
					.forEach((cell, j) => {
						if (cell === "." || cell === "#") {
							map[`${j+1};${i+1}`] = cell;
						}
					}));
		}
		else {
			for (let m of block.matchAll(/(?:(\d+)|([RL]))/g)) {
				moves.push(m[2] || (+m[1]));
			}
		}
	});

let wrappingCoords = {};
const wrappingParts = [
	[
		[[[51,100],0], [[51,100],150], 3, 3],
		[[[51,100],151], [[51,100],1], 1, 1],
		[[[101,150], 0], [[101,150],50], 3, 3],
		[[[101,150],51], [[101,150],1], 1, 1],
		[[50,[1,50]], [150,[1,50]], 2, 2],
		[[151,[1,50]], [51,[1,50]], 0, 0],
		[[50,[51,100]], [100,[51,100]], 2, 2],
		[[101,[51,100]], [51,[51,100]], 0, 0],
		[[0,[101,150]], [100,[101,150]], 2, 2],
		[[101,[101,150]], [1,[101,150]], 0, 0],
		[[0,[151,200]], [50,[151,200]], 2, 2],
		[[51,[151,200]], [1,[151,200]], 0, 0],
		[[[1,50],100], [[1,50],200], 3, 3],
		[[[1,50],201], [[1,50],101], 1, 1]
	],
	[
		[[[51,100],0], [1, [151,200]], 3, 0],
		[[0,[151,200]], [[51,100], 1], 2, 1],
		[[[101,150], 0], [[1,50], 200], 3, 3],
		[[[1, 50], 201], [[101,150],1], 1, 1],
		[[50,[1,50]], [1,[150,101]], 2, 0],
		[[0,[150,101]], [51,[1,50]], 2, 0],
		[[50,[51,100]], [[1,50],101], 2, 1],
		[[[1,50],100], [51,[51,100]], 3, 0],
		[[[101,150],51], [100,[51,100]], 1, 2],
		[[101,[51,100]], [[101,150],50], 0, 3],
		[[[51,100],151], [50,[151,200]], 1, 2],
		[[51,[151,200]], [[51,100],150], 0, 3],
		[[151,[50,1]], [100,[101,150]], 0, 2],
		[[101,[101,150]], [150,[50,1]], 0, 2]
	]
];

function movePlayer(player, move) {
	const nextPlayer =  {...player};
	if (move === "R") {
		nextPlayer.dir = (nextPlayer.dir+1) % 4;
	}
	else if (move === "L") {
		nextPlayer.dir = (nextPlayer.dir+3) % 4;
	}
	else {
		let dir;
		for (let i = 0; i < move; i++) {
			if (nextPlayer.dir === 0) {
				let coords = `${nextPlayer.pos[0]+1};${nextPlayer.pos[1]}`;
				let cell = map[coords];
				if (!cell) {
					[coords, dir] = wrappingCoords[`${coords};${nextPlayer.dir}`];
					cell = map[coords];
					if (cell === ".") {
						nextPlayer.pos = coords.split(";").map(x => +x);
						nextPlayer.dir = dir;
					}
					else if (cell === "#") {
						break;
					}
				}
				else if (cell === ".") {
					nextPlayer.pos[0] = nextPlayer.pos[0]+1;
				}
				else if (cell === "#") {
					break;
				}
			}
			else if (nextPlayer.dir === 1) {
				let coords = `${nextPlayer.pos[0]};${nextPlayer.pos[1]+1}`;
				let cell = map[coords];
				if (!cell) {
					[coords, dir] = wrappingCoords[`${coords};${nextPlayer.dir}`];
					cell = map[coords];
					if (cell === ".") {
						nextPlayer.pos = coords.split(";").map(x => +x);
						nextPlayer.dir = dir;
					}
					else if (cell === "#") {
						break;
					}
				}
				else if (cell === ".") {
					nextPlayer.pos[1] = nextPlayer.pos[1]+1;
				}
				else if (cell === "#") {
					break;
				}
			}
			else if (nextPlayer.dir === 2) {
				let coords = `${nextPlayer.pos[0]-1};${nextPlayer.pos[1]}`;
				let cell = map[coords];
				if (!cell) {
					[coords, dir] = wrappingCoords[`${coords};${nextPlayer.dir}`];
					cell = map[coords];
					if (cell === ".") {
						nextPlayer.pos = coords.split(";").map(x => +x);
						nextPlayer.dir = dir;
					}
					else if (cell === "#") {
						break;
					}
				}
				else if (cell === ".") {
					nextPlayer.pos[0] = nextPlayer.pos[0]-1;
				}
				else if (cell === "#") {
					break;
				}
			}
			else {
				let coords = `${nextPlayer.pos[0]};${nextPlayer.pos[1]-1}`;
				let cell = map[coords];
				if (!cell) {
					[coords, dir] = wrappingCoords[`${coords};${nextPlayer.dir}`];
					cell = map[coords];
					if (cell === ".") {
						nextPlayer.pos = coords.split(";").map(x => +x);
						nextPlayer.dir = dir;
					}
					else if (cell === "#") {
						break;
					}
				}
				else if (cell === ".") {
					nextPlayer.pos[1] = nextPlayer.pos[1]-1;
				}
				else if (cell === "#") {
					break;
				}
			}
		}
	}
	return nextPlayer;
}

for (let part of [1,2]) {
	wrappingCoords = {};
	wrappingParts[part-1]
		.forEach(wrap => {
			const start_i = wrap[0][0];
			const start_j = wrap[0][1];
			const end_i = wrap[1][0];
			const end_j = wrap[1][1];
			if (start_i instanceof Array && end_i instanceof Array) {
				const startDir = start_i[0] < start_i[1] ? 1 : -1;
				const endDir = end_i[0] < end_i[1] ? 1 : -1;
				let start_in = start_i[0];
				let end_in = end_i[0];
				for (let n = 0; n < 50; n++) {
					wrappingCoords[`${start_in};${start_j};${wrap[2]}`] = [`${end_in};${end_j}`, wrap[3]];
					start_in += startDir;
					end_in += endDir;
				}
			}
			else if (start_i instanceof Array && end_j instanceof Array) {
				const startDir = start_i[0] < start_i[1] ? 1 : -1;
				const endDir = end_j[0] < end_j[1] ? 1 : -1;
				let start_in = start_i[0];
				let end_jn = end_j[0];
				for (let n = 0; n < 50; n++) {
					wrappingCoords[`${start_in};${start_j};${wrap[2]}`] = [`${end_i};${end_jn}`, wrap[3]];
					start_in += startDir;
					end_jn += endDir;
				}
			}
			else if (start_j instanceof Array && end_i instanceof Array) {
				const startDir = start_j[0] < start_j[1] ? 1 : -1;
				const endDir = end_i[0] < end_i[1] ? 1 : -1;
				let start_jn = start_j[0];
				let end_in = end_i[0];
				for (let n = 0; n < 50; n++) {
					wrappingCoords[`${start_i};${start_jn};${wrap[2]}`] = [`${end_in};${end_j}`, wrap[3]];
					start_jn += startDir;
					end_in += endDir;
				}
			}
			else if (start_j instanceof Array && end_j instanceof Array) {
				const startDir = start_j[0] < start_j[1] ? 1 : -1;
				const endDir = end_j[0] < end_j[1] ? 1 : -1;
				let start_jn = start_j[0];
				let end_jn = end_j[0];
				for (let n = 0; n < 50; n++) {
					wrappingCoords[`${start_i};${start_jn};${wrap[2]}`] = [`${end_i};${end_jn}`, wrap[3]];
					start_jn += startDir;
					end_jn += endDir;
				}
			}
		});

	let player = {
		pos: Object.keys(map)[0].split(";").map(x => +x),
		dir: 0 // 0-Right, 1-Down, 2-Left, 3-Up
	};
	for (let move of moves) {
		player = movePlayer(player, move);
	}

	const pwd = 1000 * player.pos[1] + 4 * player.pos[0] + player.dir;
	console.log(`part: ${part}, pwd: ${pwd}`);
}
