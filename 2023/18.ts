import * as fs from "fs";
import { SuperMap, SuperSet, extend, insertInSortedArray, isArray, memoize } from "./tools";

//let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const offsets = { U: [-1,0], D: [1,0], L: [0,-1], R: [0,1] };
const directions = ["R","D","L","U"];

const cmds: any[] = input.split(/\r?\n/).map(line => {
	const [dir, nb, color] = line.split(" ");
	//return [dir, +nb, color.replace(/\((#\w+)\)/, "$1")];
	const m = /\(#(\w{5})(\d)\)/.exec(color);
	return [directions[+m[2]], parseInt(m[1], 16)];
});

let pos = [0,0];
const edges = [];
const gridBounds = [0,0,0,0]; // t,r,b,l
for (const cmd of cmds)
{
	const posA = pos.slice();
	pos[0] += offsets[cmd[0]][0]*cmd[1];
	pos[1] += offsets[cmd[0]][1]*cmd[1];
	const posB = pos.slice();

	const edge = [];
	if ((posA[0] === posB[0] && posA[1] < posB[1]) || posA[0] < posB[0])
	{
		edge.splice(0, 0, posA, posB);
	}
	else
	{
		edge.splice(0, 0, posB, posA);
	}
	edges.push(edge);
	
	gridBounds[0] = Math.min(gridBounds[0], pos[0]);
	gridBounds[1] = Math.max(gridBounds[1], pos[1]);
	gridBounds[2] = Math.max(gridBounds[2], pos[0]);
	gridBounds[3] = Math.min(gridBounds[3], pos[1]);
}
console.log(edges);

const verticalEdgesMap = new SuperMap();
for (const edge of edges)
{
	if (edge[0][1] === edge[1][1])
	{
		verticalEdgesMap.set(edge[0], edge[1]);
		verticalEdgesMap.set(edge[1], edge[0]);
	}
}

function intersect(line: number)
{
	const points = [];
	for (const edge of edges)
	{
		if (edge[0][0] === line && edge[1][0] === line) // on the same line
		{
			const vertEdge1 = verticalEdgesMap.get(edge[0]);
			const vertEdge2 = verticalEdgesMap.get(edge[1]);
			const noBend = (vertEdge1[0] < line && line < vertEdge2[0]) || (vertEdge2[0] < line && line < vertEdge1[0])
			points.push([line, Math.min(edge[0][1], edge[1][1]), Math.max(edge[0][1], edge[1][1]), noBend]);
		}
		else if (edge[0][0] < line && line < edge[1][0]) // intersect line
		{
			points.push([line, edge[0][1]]);
		}
	}
	return points.sort((a,b) => a[1] - b[1]);
}

let area = 0;
for (let i = gridBounds[0]; i <= gridBounds[2]; i++)
{
	let _in = false;
	let prev = null;
	const points = intersect(i);
	for (const point of points)
	{
		if (point.length > 2) // horizontal
		{
			if (prev && _in)
			{
				area += point[1] - prev[1];
			}
			area += point[2] - point[1] + 1;
			_in = point[3] ? !_in : _in;
			if (_in)
			{
				prev = [point[0],point[2]+1];
			}
		}
		else
		{
			if (!_in)
			{
				_in = true;
				prev = point;
			}
			else
			{
				_in = false;
				area += point[1] - prev[1] + 1;
			}
		}
	}
}

console.log(area);