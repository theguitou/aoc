import * as fs from "fs";
import { SuperMap, SuperSet, extend, ppcmx } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let startPos: number[];
const grid = input.split(/\r?\n/).map((line, r) => {
	const c = line.indexOf("S");
	if (c !== -1) {
		startPos = [r,c];
	}
	return line.split("")
});

// compute progression of each new grid (extension)
const points = [new SuperMap<any, any>(),new SuperMap<any, any>()];
const visitedpoints = [new SuperSet(),new SuperSet()];
const gridProg = new SuperMap<any, any>();
let queue = [startPos];
for (let i = 1; i <= 1000; i++)
{
	const nextqueue = [];
	for (const pt of queue)
	{
		for (const offset of [[0,1],[0,-1],[1,0],[-1,0]])
		{
			const nextpt = [pt[0]+offset[0],pt[1]+offset[1]];
			// coords in new ref
			const refnextpt = nextpt.slice();
			refnextpt[0] = nextpt[0] < 0 ? ((grid.length + nextpt[0]%grid.length)%grid.length) : (nextpt[0]%grid.length);
			refnextpt[1] = nextpt[1] < 0 ? ((grid[0].length + nextpt[1]%grid[0].length)%grid[0].length) : (nextpt[1]%grid[0].length);
			const c = grid[refnextpt[0]][refnextpt[1]]
			if ((c === "." || c === "S") && !visitedpoints[i%2].has(nextpt))
			{
				nextqueue.push(nextpt);
				visitedpoints[i%2].add(nextpt);

				const gridCoords = [Math.floor(nextpt[0]/grid.length), Math.floor(nextpt[1]/grid[0].length)];
				if (!points[i%2].has(gridCoords))
				{
					points[i%2].set(gridCoords, new SuperSet());
				}
				if (!gridProg.has(gridCoords))
				{
					gridProg.set(gridCoords, {
						stepStart: i,
						countProg: [] // <step from startStep,size>
					});
				}
				points[i%2].get(gridCoords).add(nextpt);
				gridProg.get(gridCoords).countProg[i-gridProg.get(gridCoords).stepStart] = points[i%2].get(gridCoords).size;
			}
		}
	}
	queue = nextqueue;
}

/// determine of type of progression
const gridProgByType = new Map<any,any>();
for (const [gridCoords,info] of gridProg)
{
	const key = info.countProg.join(",");
	const lastCOunts = info.countProg.slice(info.countProg.length-2).join(",");
	if (lastCOunts === "7434,7427" || lastCOunts === "7427,7434")
	{
		if (!gridProgByType.has(key))
		{
			gridProgByType.set(key, {
				startMap: new Map<any,any>(),
				counts: info.countProg
			});
		}
		gridProgByType.get(key).startMap.set(info.stepStart, (gridProgByType.get(key).startMap.get(info.stepStart)||0)+1)
	}
	// other entries are start of other types
}
// complete information
for (const [itrKey,itrInfo] of gridProgByType)
{
	const steps = [...itrInfo.startMap.keys()].sort((a,b) => a-b);
	if (itrInfo.startMap.size > 1)
	{
		itrInfo.startStep = steps[0];
		itrInfo.offsetStep = steps[1] - steps[0];
		itrInfo.startNbGrid = itrInfo.startMap.get(steps[0]);
		itrInfo.offsetNbGrid = itrInfo.startMap.get(steps[1]) - itrInfo.startNbGrid;
	}
	itrInfo.steps = steps;
}

for (const goal of [64,26501365])
{
	let sum = 0;
	for (const [itrKey,itrInfo] of gridProgByType)
	{
		if (itrInfo.startMap.size > 1)
		{
			const startedCount = Math.ceil((goal - itrInfo.startStep)/itrInfo.offsetStep);
			for (let i = 0; i < startedCount; i++)
			{
				const startStep = itrInfo.steps[0] + i*itrInfo.offsetStep;
				const endStep = startStep + itrInfo.counts.length - 1;
	
				let lastCountStep = startStep + itrInfo.counts.length - 1;
				const countEvenStep = !(lastCountStep%2) ? itrInfo.counts[itrInfo.counts.length-1] : itrInfo.counts[itrInfo.counts.length-2];
				const countOddStep = (lastCountStep%2) ? itrInfo.counts[itrInfo.counts.length-1] : itrInfo.counts[itrInfo.counts.length-2];
				const countAtStep = !(goal%2) ? countEvenStep : countOddStep;
	
				if (endStep <= goal)
				{
					const nb = itrInfo.offsetNbGrid*i+1;
					const count = !(goal%2) ? countEvenStep : countOddStep;
					sum += nb * count;
				}
				else
				{
					const goalNbStep = goal-startStep;
					const nb = itrInfo.offsetNbGrid*i + 1;
					const count = itrInfo.counts[goalNbStep];
					sum += nb * count;
				}
			}
		}
		else if (itrInfo.steps[0] <= goal)
		{
			let lastCountStep = itrInfo.steps[0] + itrInfo.counts.length - 1;
			const countEvenStep = !(lastCountStep%2) ? itrInfo.counts[itrInfo.counts.length-1] : itrInfo.counts[itrInfo.counts.length-2];
			const countOddStep = (lastCountStep%2) ? itrInfo.counts[itrInfo.counts.length-1] : itrInfo.counts[itrInfo.counts.length-2];
			const countAtStep = !(goal%2) ? countEvenStep : countOddStep;
			if (lastCountStep > goal)
			{
				const goalNbStep = goal-itrInfo.steps[0];
				const count = itrInfo.counts[goalNbStep];
				sum += count;
			}
			else
			{
				sum += countAtStep;
			}
		}
	}
	console.log(`at ${goal}: ${sum}`);
}
