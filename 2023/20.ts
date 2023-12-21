import * as fs from "fs";
import { ppcmx } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let broadcaster: string[];
const modules = new Map();
// parsing
for (const line of input.split(/\r?\n/))
{
	let m = /broadcaster -> ([\w,\s]+)/.exec(line);
	if (m)
	{
		broadcaster = m[1].split(", ");
		continue;
	}
	m = /&(\w+) -> ([\w,\s]+)/.exec(line);
	if (m)
	{
		const conjModule = {
			type: "conjunction",
			outputs: m[2].split(", "),
			stateMap: new Map()
		};
		modules.set(m[1], conjModule);
		continue;
	}
	m = /%(\w+) -> ([\w,\s]+)/.exec(line);
	if (m)
	{
		const flipflopModule = {
			type: "flipflop",
			outputs: m[2].split(", "),
			state: false
		};
		modules.set(m[1], flipflopModule);
		continue;
	}
}
// init conjunction module stateMap
for (const [inputName, module] of modules)
{
	for (const outputName of module.outputs)
	{
		const outputModule = modules.get(outputName);
		if (outputModule?.type === "conjunction")
		{
			outputModule.stateMap.set(inputName, 0);
		}
	}
}

function runCycle(num, pulseCounter, highPulseForNodes)
{
	pulseCounter[0]++;
	const pulseQueue = broadcaster.map(name => [name,0]);
	while (pulseQueue.length > 0)
	{
		const pulse = pulseQueue.shift();
		pulseCounter[pulse[1]]++;
		const module = modules.get(pulse[0]);
		if (module)
		{
			let nextPulseValue: number = -1;
			if (module.type === "flipflop")
			{
				if (pulse[1] === 0)
				{
					module.state = !module.state;
					nextPulseValue = module.state ? 1 : 0;
				}
			}
			else // conjunction
			{
				module.stateMap.set(pulse[2], pulse[1]);
				nextPulseValue = [...module.stateMap.values()].every(pulse => pulse === 1) ? 0 : 1;
			}
			if (nextPulseValue !== -1)
			{
				if (nextPulseValue === 1 && pulse[0] in highPulseForNodes)
				{
					highPulseForNodes[pulse[0]] = num;
				}
				for (const name of module.outputs)
				{
					pulseQueue.push([name, nextPulseValue, pulse[0]])
				}
			}
		}
	}
}

let cycle = 0;
const pulseCounter = [0,0];
const highPulseForNodes = { qs: -1, sv: -1, pg: -1, sp: -1 };
for (const p2 of [false,true])
{
	let end = false;
	for (; !end; cycle++)
	{
		if (!p2 && cycle >= 1000)
		{
			console.log(pulseCounter[0] * pulseCounter[1]);
			end = true;
		}
		if (p2 && Object.values(highPulseForNodes).every(n => n !== -1))
		{
			console.log(ppcmx(...Object.values(highPulseForNodes)));
			end = true;
		}
		runCycle(cycle+1, pulseCounter, highPulseForNodes);
	}
}
