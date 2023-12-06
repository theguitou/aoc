import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const lines = input.split("\n");

let seeds: number[];
let seedsRanges = [];
const mapsForTypes = [];
for (const line of lines)
{
	if (line.startsWith("seeds: "))
	{
		seeds = line.replace("seeds: ", "").split(" ").map(n => +n);
		for (let i = 0; i < seeds.length; i=i+2)
		{
			seedsRanges.push([seeds[i], seeds[i+1]]);
		}
	}
	else if (line.endsWith("map:"))
	{
		mapsForTypes[mapsForTypes.length] = [];
	}
	else if (line)
	{
		mapsForTypes[mapsForTypes.length-1].push(line.split(" ").map(n => +n));
	}
}
for (const mapsForType of mapsForTypes)
{
	mapsForType.sort((a, b) => a[1] - b[1]);
}

let minLocation = Number.MAX_VALUE;
for (let number of seeds)
{
	for (const mapsForType of mapsForTypes)
	{
		for (const map of mapsForType)
		{
			if (map[1] <= number && number < (map[1] + map[2]))
			{
				number = map[0] + number - map[1];
				break;
			}
		}
	}
	minLocation = Math.min(minLocation, number);
}
console.log(minLocation);

let nextRanges = seedsRanges;
for (const mapsForType of mapsForTypes)
{
	const ranges = nextRanges;
	nextRanges = [];
	for (let [start, length] of ranges)
	{
		while (length)
		{
			let found = false;
			for (const map of mapsForType)
			{
				if (start < map[1])
				{
					if ((start + length - 1) < map[1])
					{
						nextRanges.push([start, length]);
						length = 0;
						found = true;
					}
					else
					{
						nextRanges.push([start, map[1] - start]);
						length -= map[1] - start;
						start = map[1];
						found = true;
					}
				}
				else if (map[1] <= start && start < (map[1] + map[2]))
				{
					if ((start + length - 1) < (map[1] + map[2]))
					{
						nextRanges.push([map[0] + start - map[1], length]);
						length = 0;
						found = true;
					}
					else
					{
						nextRanges.push([map[0] + start - map[1], map[1] + map[2] - start]);
						const prevStart = start;
						start = map[1] + map[2];
						length = length + prevStart - (map[1] + map[2]);
						found = true;
					}
				}
				if (found)
				{
					break;
				}
			}
			if (!found)
			{
				nextRanges.push([start, length]);
				length = 0;
			}
		}
	}
}
console.log(nextRanges.sort((a, b) => a[0] - b[0])[0][0]);