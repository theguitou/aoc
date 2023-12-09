import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

function decodedLength(str: string): number
{
	let length = 0;
	for (let n = 0; n < str.length;)
	{
		const c = str[n];
		if (c !== "\"")
		{
			if (c === "\\")
			{
				let nc = str[++n];
				if (nc === "x")
				{
					n += 2;
				}
			}
			length++;
		}
		++n;
	}
	return length;
}

function encodedLength(str: string): number
{
	let length = 1; // first "
	for (let n = 0; n < str.length;)
	{
		const c = str[n];
		if (c === "\"" || c === "\\")
		{
			length++;
		}
		length++;
		++n;
	}
	return length + 1; // last "
}

const sums = [0,0];
for (const line of input.split("\n"))
{
	sums[0] = sums[0] + line.length - decodedLength(line);
	sums[1] = sums[1] + encodedLength(line) - line.length;
}
console.log(sums);
