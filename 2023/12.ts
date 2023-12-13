import * as fs from "fs";
import { memoize } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

type ComputeResult = { count: number, tryNextChar?: boolean };
const compute = memoize(function(nums: number[], i: number, chars: string[]): ComputeResult
{
	nums = nums.slice();
	const num = nums.shift();
	if (chars.length < num)
	{
		return { count: 0 };
	}
	let istart = null;
	let tryNextChar = null;
	let nbChar = 0;
	let thisGroup = false;
	for (let j = i; j < chars.length; j++)
	{
		const c = chars[j];
		if (c === "#")
		{
			if (istart === null)
			{
				istart = j;
				tryNextChar = false;
			}
			nbChar++;
			thisGroup = true;
		}
		else if (c === "?")
		{
			if (istart === null)
			{
				istart = j;
				tryNextChar = true;
			}
			nbChar++;
		}
		else if (c === ".")
		{
			if (nbChar !== 0 && thisGroup)
			{
				return { count: 0 };
			}
			istart = null;
			nbChar = 0;
		}
		if (nbChar === num)
		{
			if (chars[j+1] === "#" && !tryNextChar)
			{
				return { count: 0 };
			}
			const ret: ComputeResult = { count: 0, tryNextChar };
			if (chars[j+1] !== "#")
			{
				if (nums.length === 0)
				{
					if (chars.slice(j+2).every(ic => ic !== "#"))
					{
						ret.count++;
					}
					else if (!tryNextChar)
					{
						return { count: 0 };
					}
				}
				else
				{
					const subRet = compute(nums.slice(), j+2, chars);
					ret.count += subRet.count;
				}
			}
			while (ret.tryNextChar)
			{
				const nextCharRet = compute([num].concat(nums), ++istart, chars);
				ret.count += nextCharRet.count;
				ret.tryNextChar = nextCharRet.tryNextChar && nextCharRet.count !== 0;
			}
			return ret;
		}
	}
	return { count: 0 };
}, [0,1]);

for (const len of [1, 5])
{
	let sum = 0;
	for (const line of input.split("\n"))
	{
		const parts = line.split(" ");
		const chars = new Array(len).fill(parts[0]).join("?").split("");
		const nums = new Array(len).fill(parts[1]).join(",").split(",").map(n => +n);
		compute.reset();
		const ret = compute(nums.slice(), 0, chars);
		sum += ret.count;
	}
	console.log(sum);
}
