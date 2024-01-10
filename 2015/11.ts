import { range } from "./tools";

const toNumber = (chars) => chars.map(c => c.charCodeAt(0)-97);
const toChar = (numbers) => numbers.map(n => String.fromCharCode(n+97));

const forbiddenNumbers = toNumber(["i","l","o"]);
function matchPolicy(numbers)
{
	const increasingNums = [];
	const firstPair = [];
	const secondPair = [];
	for (const n of numbers)
	{
		if (forbiddenNumbers.includes(n))
		{
			return false;
		}
		if (increasingNums.length < 3)
		{
			const toRemove = (increasingNums[0]+1) === n ? 0 : increasingNums.length;
			increasingNums.splice(0, toRemove, n);
		}
		if (firstPair.length < 2)
		{
			const toRemove = firstPair[0] === n ? 0 : firstPair.length;
			firstPair.splice(0, toRemove, n);
		}
		else if (secondPair.length < 2 && firstPair[0] !== n)
		{
			const toRemove = secondPair[0] === n ? 0 : secondPair.length;
			secondPair.splice(0, toRemove, n);
		}
	}
	return increasingNums.length === 3 && firstPair.length === 2 && secondPair.length === 2;
}

let input = toNumber("cqjxjnds".split(""));

for (const _ of range(0,2))
{
	do
	{
		for (const i of range(input.length-1, 0))
		{
			input[i] = (input[i]+1)%26;
			if (input[i] !== 0)
			{
				break;
			}
		}
	} while (!matchPolicy(input));
	console.log(toChar(input).join(""));
}
