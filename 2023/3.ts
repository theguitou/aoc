import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const lines = input.split("\n");

const symbolsByLines = [];
const numbersByLines = [];
for (let j = 0; j < lines.length; j++)
{
	const line = lines[j];
	const numbers = numbersByLines[j] = [];
	const mNum = line.matchAll(/\d+/g);
	for (const m of mNum)
	{
		numbers.push({ val: m[0], pos: m.index });
	}
	const symbols = symbolsByLines[j] = [];
	const mSymbol = line.matchAll(/[^\d\.]/g);
	for (const m of mSymbol)
	{
		symbols.push({ val: m[0], pos: m.index, adjacents: [] });
	}
}

function hasAdjacentSymbol(val, boundingBox): boolean
{
	let ret = false;
	for (let j = boundingBox.t; j <= boundingBox.b; j++)
	{
		for (const symbol of symbolsByLines[j])
		{
			if (boundingBox.l <= symbol.pos && symbol.pos <= boundingBox.r)
			{
				symbol.adjacents.push(val);
				ret = true;
			}
		}
	}
	return ret;
}

let sum = 0;
for (let j = 0; j < lines.length; j++)
{
	for (const number of numbersByLines[j])
	{
		const adjacent = hasAdjacentSymbol(+number.val, {
			t: Math.max(0, j-1),
			l: Math.max(0, number.pos-1),
			b: Math.min(lines.length-1, j+1),
			r: Math.min(lines[0].length-1, number.pos+number.val.length),
		});
		if (adjacent)
		{
			sum += +number.val;
		}
	}
}
console.log(sum);

sum = 0;
for (let j = 0; j < lines.length; j++)
{
	for (const symbol of symbolsByLines[j])
	{
		if (symbol.val === "*" && symbol.adjacents.length === 2)
		{
			sum += symbol.adjacents[0] * symbol.adjacents[1];
		}
	}
}
console.log(sum);
