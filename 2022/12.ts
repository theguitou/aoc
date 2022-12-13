import * as fs from "fs";

let input = fs.readFileSync('./input.txt',
// let input = fs.readFileSync('./input_test.txt',
	{encoding:'utf8', flag:'r'});

function compare(left, right)
{
	const leftArray = left instanceof Array;
	const rightArray = right instanceof Array;
	if (!leftArray && !rightArray) {
		if (left < right)
			return -1;
		if (left === right)
			return 0;
		return 1;
	}
	if (leftArray && rightArray) {
		let i = 0;
		for (; i < left.length && i < right.length; i++)
		{
			const c = compare(left[i], right[i]);
			if (c !== 0)
				return c;
		}
		if (i === left.length && i < right.length)
			return -1;
		if (i === right.length && i < left.length)
			return 1;
		return 0
	}
	if (leftArray) {
		return compare(left, [right]);
	}
	return compare([left], right);
}

function main()
{
	const lines = [];
	input.split("\n").filter(line => !!line.length)
		.map(line => {
			lines.push(eval(line));
		});

	for (let part of [1,2])
	{
		let result;
		if (part === 1)
		{
			const rightOrderList = [];
			for (let i = 0; i < lines.length/2; i++) {
				const cmp = compare(lines[i*2], lines[i*2+1])
				if (cmp === -1)
				{
					rightOrderList.push(i+1);
				}
			}
			result = rightOrderList.reduce((s, x) => s + x, 0);
		}
		else
		{
			const ref1 = [[2]], ref2 = [[6]];
			lines.push(ref1, ref2);
			result = 1;
			lines.sort((left, right) => compare(left, right));
			lines.forEach((line, i) => {
				if (line === ref1 || line === ref2) {
					result *= i+1;
				}
			});
		}
		console.log(`part: ${part}, result: ${result}`);
	}
}

main();