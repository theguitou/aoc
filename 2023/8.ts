import * as fs from "fs";
import { ppcm } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let cmds: number[] = null;
const nodes = new Map<string, string[]>();
const startingNodes: string[] = [];
for (const line of input.split("\n"))
{
	if (line)
	{
		if (!cmds)
		{
			cmds = line.split("").map(c => c === "R" ? 1 : 0);
		}
		else
		{
			const m = line.match(/(\w+) = \((\w+), (\w+)\)/);
			nodes.set(m[1], [m[2], m[3]]);
			if (m[1].endsWith("A"))
			{
				startingNodes.push(m[1]);
			}
		}
	}
}

for (const part of [1, 2])
{
	let currentNodes = part === 2 ? startingNodes : ["AAA"];
	let step = 0;
	const goalSteps = new Map<number, number>();
	while (goalSteps.size !== currentNodes.length)
	{
		const cmd = cmds[(step++) % cmds.length];
		const nextNodes: string[] = [];
		for (let i = 0; i < currentNodes.length; i++)
		{
			const n = currentNodes[i];
			const lrNodes = nodes.get(n);
			nextNodes.push(lrNodes[cmd]);
			if (part === 2 ? n.endsWith("Z") : (n === "ZZZ"))
			{
				goalSteps.set(i, step-1);
			}
		}
		currentNodes = nextNodes;
	}
	console.log([...goalSteps.values()].reduce((r, n) => ppcm(r, n), 1));
}
