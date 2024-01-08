import * as fs from "fs";
import { enumerate, insertInSortedArray, size } from "./tools";

let input = fs.readFileSync('./input.txt', { encoding: 'utf8', flag: 'r' });
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const citiesDistances = {};
for (const line of input.split("\n"))
{
	const [_, cityA, cityB, dist] = line.match(/(\w+) to (\w+) = (\d+)/);
	const cityADistances = citiesDistances[cityA] = citiesDistances[cityA] || {};
	cityADistances[cityB] = +dist;
	const cityBDistances = citiesDistances[cityB] = citiesDistances[cityB] || {};
	cityBDistances[cityA] = +dist;
}

const nbCities = size(citiesDistances);
const allPaths = [];
for (const [startCity,_] of enumerate(citiesDistances))
{
	const queue: any = [[[startCity], 0]];
	while (queue.length)
	{
		const [path, totalDistance] = queue.shift();
		if (path.length === nbCities)
		{
			insertInSortedArray(allPaths, [JSON.stringify(path), totalDistance], (a,b) => a[1]-b[1]);
			continue;
		}

		const city = path[0];
		for (const [nextCity,distance] of enumerate(citiesDistances[city]))
		{
			if (!path.includes(nextCity))
			{
				const nextpath = path.slice();
				nextpath.splice(0,0,nextCity);
				queue.push([nextpath, totalDistance+distance]);
			}
		}
	}
}

console.log(allPaths[0][1]);
console.log(allPaths[allPaths.length-1][1]);
