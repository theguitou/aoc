import * as fs from "fs";
import { SuperMap } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const bricks = input
	.split(/\r?\n/)
	.map((line, i) => {
		const ends = line.split("~")
			.map(end => end.split(",").map(n => +n))
			.sort((a,b) => a[2] - b[2]);
		return { idx: i, ends, support: new Set<number>(), supported: new Set<number>() };
	});
const sortedBricks = bricks.slice().sort((a,b) => a.ends[0][2] - b.ends[0][2]);

const gridPoints = new SuperMap<number[]/*pos*/,number/*brick idx*/>();
for (const brick of sortedBricks)
{
	let offsetZ = 0;
	if (brick.ends[0][2] > 1)
	{
		for (let i = 1; true; i++)
		{
			let offsetOK = true;
			const dir = brick.ends[0][0] !== brick.ends[1][0] ? 0 : 1;
			for (let j = Math.min(brick.ends[0][dir], brick.ends[1][dir]); j <= Math.max(brick.ends[0][dir], brick.ends[1][dir]); j++)
			{
				const pt = brick.ends[0].slice();
				pt[dir] = j;
				pt[2] -= i;
				if (gridPoints.has(pt))
				{
					const ptIdx = gridPoints.get(pt);
					brick.supported.add(ptIdx);
					bricks[ptIdx].support.add(brick.idx);
					offsetOK = false;
				}
			}
			offsetZ = i - (offsetOK ? 0 : 1);
			if (!offsetOK || (brick.ends[0][2] - offsetZ) === 1)
			{
				break;
			}
		}
	}

	const dir = brick.ends[0][2] !== brick.ends[1][2] ? 2 : (brick.ends[0][0] !== brick.ends[1][0] ? 0 : 1);
	for (let j = Math.min(brick.ends[0][dir], brick.ends[1][dir]); j <= Math.max(brick.ends[0][dir], brick.ends[1][dir]); j++)
	{
		const pt = brick.ends[0].slice();
		pt[dir] = j;
		pt[2] -= offsetZ;
		gridPoints.set(pt, brick.idx);
	}
}

for (const p of [1,2])
{
	let count = 0;
	for (const brick of bricks)
	{
		if (p === 1)
		{
			let allSupported = true;
			for (const supportIdx of brick.support)
			{
				const supportedBrick = bricks[supportIdx];
				if (supportedBrick.supported.size === 1)
				{
					allSupported = false;
				}
			}
			if (allSupported)
			{
				count++;
			}
		}
		else
		{
			const visitedBricks = new Set();
			visitedBricks.add(brick.idx);
			const bricksToExplore = [brick.idx];
			while (bricksToExplore.length > 0)
			{
				const expBrick = bricks[bricksToExplore.shift()];
				for (const supportIdx of expBrick.support)
				{
					const supportBrick = bricks[supportIdx];
					const supportedBricks = [...supportBrick.supported];
					if (!visitedBricks.has(supportIdx))
					{
						bricksToExplore.push(supportIdx);
					}
					if (supportedBricks.every(idx => visitedBricks.has(idx)))
					{
						visitedBricks.add(supportIdx);
					}
				}
			}
			count += visitedBricks.size - 1;
		}
	}
	console.log(count);
}
