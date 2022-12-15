import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const knownCells = new Set();
const sensors = input.split("\n")
	.map(line => {
		const m = /Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)/.exec(line);
		const sensor = {
			pos: [+m[1], +m[2]],
			bpos: [+m[3], +m[4]],
			dist: 0
		};
		sensor.dist = Math.abs(sensor.pos[0] - sensor.bpos[0]) + Math.abs(sensor.pos[1] - sensor.bpos[1])
		knownCells.add(`${sensor.pos[0]};${sensor.pos[1]}`);
		knownCells.add(`${sensor.bpos[0]};${sensor.bpos[1]}`);
		return sensor;
	});

for (let part of [1,2])
{
	try {
		let [y_start, y_end] = [[2000000, 2000000], [0,4000000]][part-1];
		// let [y_start, y_end] = [[10, 10], [0,20]][part-1];
		for (let y = y_start; y <= y_end; y++)
		{
			let segments = [];
			for (let sensor of sensors)
			{
				const maxY = Math.abs(sensor.pos[1] - y);
				if (maxY <= sensor.dist)
				{
					const maxX = sensor.pos[0] + (sensor.dist - maxY);
					const minX = sensor.pos[0] - (sensor.dist - maxY);
					segments.push([minX, maxX]);
				}
			}
			segments.sort((s1, s2) => s1[0] - s2[0]);

			if (part === 1) {
				const possibleCells = new Set();
				for (let segment of segments) {
					for (let i = segment[0]; i <= segment[1]; i++) {
						const cell = `${i};${y}`;
						if (!knownCells.has(cell)) {
							possibleCells.add(cell);
						}
					}
				}
				console.log(`part: ${part}, result: ${possibleCells.size}`);
			}
			else {
				const concatSegment = segments[0];
				for (let i = 1; i < segments.length; i++) {
					const segment = segments[i];
					if (segment[0] <= concatSegment[1]) {
						concatSegment[1] = Math.max(segment[1], concatSegment[1]);
					}
					else {
						console.log(`part: ${part}, result: ${4000000*(concatSegment[1]+1)+y}`);
						throw "Next!";
					}
				}
			}
		}
	}
	catch {
	}
}
