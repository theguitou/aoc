import * as fs from "fs";

let input = fs.readFileSync('./input.txt',
// let input = fs.readFileSync('./input_test.txt',
	{encoding:'utf8', flag:'r'});

function main()
{
	const s = input.split("\n").map(line => line.split(""));
	console.log("thx!");
}

main();