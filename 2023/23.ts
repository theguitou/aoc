import * as fs from "fs";
import { SuperMap, SuperSet, extend } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const grid = input.split(/\r?\n/)
	.map(line => line.split(""));

const start = [0,1];
const end = [grid.length-1,grid[0].length-2];

function dfs_p1(node, path, longestPathLength)
{
	if (node[0] === end[0] && node[1] === end[1])
	{
		return path.length > longestPathLength ? path : null;
	}

	let longestPath = null;

	for (const offset of [[-1,0,"v"],[1,0,"^"],[0,-1,">"],[0,1,"<"]])
	{
		const nextNode = [node[0]+offset[0],node[1]+offset[1]];
		const nextNodeType = grid[nextNode[0]]?.[nextNode[1]];
		if (nextNodeType && nextNodeType !== "#" && nextNodeType !== offset[2] &&
			path.findIndex(itr => itr[0] === nextNode[0] && itr[1] === nextNode[1]) === -1)
		{
			const nextPath = path.concat([nextNode]);
			const longestPathWithNextNode = dfs_p1(nextNode, nextPath, longestPathLength);
			if (longestPathWithNextNode)
			{
				longestPath = longestPathWithNextNode;
				longestPathLength = longestPath.length;
			}
		}
	}

	return longestPath;
}

console.log(dfs_p1(start, [start], 0).length-1);

const add = (p1, p2) => [p1[0]+p2[0], p1[1]+p2[1]];
const mul = (p, f) => [p[0]*f, p[1]*f];

function getEdge(from): { from, to, length, nextNodes }
{
	const visited = new SuperSet();
	visited.add(from.pos);
	const nextNodes = [{ pos: add(from.pos, from.dir), dir: from.dir }];
	let lastNode = null;
	while (nextNodes.length === 1)
	{
		lastNode = nextNodes.shift();
		visited.add(lastNode.pos);
		for (const dir of [[-1,0],[1,0],[0,-1],[0,1]])
		{
			const nextNodePos = add(lastNode.pos, dir);
			const nextNodeType = grid[nextNodePos[0]]?.[nextNodePos[1]];
			if (nextNodeType && nextNodeType !== "#" && !visited.has(nextNodePos))
			{
				nextNodes.push({ pos: nextNodePos, dir });
			}
		}
	}
	lastNode.dir = mul(lastNode.dir, -1);
	return {
		from,
		to: lastNode,
		nextNodes,
		length: visited.size-1
	};
}

// build simplified graph with nodes (where we can choose another direction)
const queue = [{ pos: start, dir: [1,0] }];
const graph = new SuperMap<any, any>();
const nodeKeys = new SuperMap<any, any>();
while (queue.length)
{
	const node = queue.shift();
	if (graph.has([node.pos, `${node.dir[0]}|${node.dir[1]}`]))
		continue;

	const edge = getEdge(node);
	graph.set([edge.from.pos, `${edge.from.dir[0]}|${edge.from.dir[1]}`], edge);
	const toEdge = extend({}, edge);
	toEdge.from = edge.to;
	toEdge.to = edge.from;
	graph.set([edge.to.pos, `${edge.to.dir[0]}|${edge.to.dir[1]}`], toEdge);
	nodeKeys.set(edge.from.pos, (nodeKeys.get(edge.from.pos) || []).concat([[edge.from.pos, `${edge.from.dir[0]}|${edge.from.dir[1]}`]]));
	nodeKeys.set(edge.to.pos, (nodeKeys.get(edge.to.pos) || []).concat([[edge.to.pos, `${edge.to.dir[0]}|${edge.to.dir[1]}`]]));

	for (const nextNode of edge.nextNodes)
	{
		queue.push({ pos: edge.to.pos, dir: nextNode.dir });
	}
}

function dsf_p2(edge, length, visited, longestPathLength)
{
	length += edge.length;
	visited.add(edge.from.pos);
	visited.add(edge.to.pos);

	if (edge.to.pos[0] === end[0] && edge.to.pos[1] === end[1])
	{
		return Math.max(length, longestPathLength);
	}

	for (const nodeKey of nodeKeys.get(edge.to.pos))
	{
		const nextEdge = graph.get(nodeKey);
		if (!visited.has(nextEdge.to.pos))
		{
			longestPathLength = Math.max(dsf_p2(nextEdge, length, visited, longestPathLength), longestPathLength);
			visited.delete(nextEdge.to.pos);
		}
	}
	return longestPathLength;
}

console.log(dsf_p2(graph.get(nodeKeys.get(start)[0]), 0, new SuperSet(), 0));
