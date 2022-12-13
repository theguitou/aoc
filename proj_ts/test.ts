import * as fs from "fs";

// let input = fs.readFileSync('./input.txt',
let input = fs.readFileSync('./input_test.txt',
	{encoding:'utf8', flag:'r'});

function main()
{
	input.split("\n");

	for (let part of [1,2])
	{
		let result;
		if (part === 1)
		{
		}
		else
		{
		}
		console.log(`part: ${part}, result: ${result}`);
	}
}

main();