import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const digitWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function getDigit(line: string, n: number, digitWords?: string[]): number
{
	const c = line[n];
	if ("1" <= c && c <= "9")
	{
		return +c;
	}
	const idx = digitWords?.findIndex(word => line.substring(n).startsWith(word));
	if (idx !== -1)
	{
		return idx+1;
	}
}

for (const p of [null,digitWords])
{
	let sum = 0;
	for (const line of input.split("\n"))
	{
		const digits = [];
		const len = line.length;
		for (let n = 0; n < len; n++)
		{
			digits[0] = digits[0] || getDigit(line, n, p);
			digits[1] = digits[1] || getDigit(line, len-n-1, p);
		}
		sum += +`${digits[0]}${digits[1]}`;
	}
	console.log(`sum: ${sum}`);
}
