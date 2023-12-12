import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

function memoizer<T>(mem: Map<string, T>, memkey: string): ((ret: T) => T)
{
	return (ret) => {
		mem.set(memkey, ret);
		return ret;
	};
}

type ComputeResult = { count: number, tryNextChar?: boolean };
function compute(nums: number[], i: number, chars: string[], mem: Map<string, ComputeResult>): ComputeResult
{
	const memkey = JSON.stringify([nums,i]);
	if (mem.has(memkey))
	{
		return mem.get(memkey);
	}
	const memoize = memoizer(mem, memkey);

	nums = nums.slice();
	const num = nums.shift();
	if (chars.length < num)
	{
		return memoize({ count: 0 });
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
				return memoize({ count: 0 });
			}
			istart = null;
			nbChar = 0;
		}
		if (nbChar === num)
		{
			if (chars[j+1] === "#" && !tryNextChar)
			{
				return memoize({ count: 0 });
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
						return memoize({ count: 0 });
					}
				}
				else
				{
					const subRet = compute(nums.slice(), j+2, chars, mem);
					ret.count += subRet.count;
				}
			}
			while (ret.tryNextChar)
			{
				const nextCharRet = compute([num].concat(nums), ++istart, chars, mem);
				ret.count += nextCharRet.count;
				ret.tryNextChar = nextCharRet.tryNextChar && nextCharRet.count !== 0;
			}
			return memoize(ret);
		}
	}
	return memoize({ count: 0 });
}

for (const len of [1, 5])
{
	let sum = 0;
	for (const line of input.split("\n"))
	{
		const parts = line.split(" ");
		const chars = new Array(len).fill(parts[0]).join("?").split("");
		const nums = new Array(len).fill(parts[1]).join(",").split(",").map(n => +n);
		const mem = new Map<string, ComputeResult>();
		const ret = compute(nums.slice(), 0, chars, mem);
		sum += ret.count;
	}
	console.log(sum);
}
