import * as fs from "fs";
import { enumerate, isArray, isNumber, isObject } from "./tools";

let input = fs.readFileSync('./input.txt', { encoding: 'utf8', flag: 'r' });
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const o = JSON.parse(input);
for (const p of [1,2])
{
	let sum = 0;
	const queue = [o];
	while (queue.length)
	{
		const v = queue.shift();
		let valid = true;
		const toPush = [];
		let toSum = 0;
		for (const [_,itr] of enumerate(v))
		{
			if (p === 2 && itr === "red" && !isArray(v))
			{
				valid = false;
				break;
			}
			if (isNumber(itr))
			{
				toSum += itr;
			}
			else if (isObject(itr))
			{
				toPush.push(itr);
			}
		}
		if (valid)
		{
			sum += toSum;
			queue.push(...toPush);
		}
	}
	console.log(sum);
}
