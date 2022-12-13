import * as fs from "fs";

let input = fs.readFileSync('./input.txt',
// let input = fs.readFileSync('./input_test.txt',
	{encoding:'utf8', flag:'r'});

function main()
{
	const lines = input.split("\n");
	const len = lines[0].length;

	for (let part of [1,2])
	{
		let result;
		if (part === 1)
		{
			let gamma = "", epsilon = "";
			for (let i = 0; i < len; i++)
			{
				let count = lines.filter(line => !!parseInt(line[i])).length;
				gamma += count > lines.length/2 ? 1 : 0;
				epsilon += count < lines.length/2 ? 1 : 0;
			}
			result = parseInt(gamma, 2) * parseInt(epsilon, 2);
		}
		else
		{
			let o2FilteredLines = lines.slice();
			for (let i = 0; i < len && o2FilteredLines.length > 1; i++)
			{
				const linesWith1 = o2FilteredLines.filter(line => !!parseInt(line[i]));
				const linesWith0 = o2FilteredLines.filter(line => !parseInt(line[i]));
				o2FilteredLines = linesWith1.length >= linesWith0.length ? linesWith1 : linesWith0;
			}
			let co2FilteredLines = lines.slice();
			for (let i = 0; i < len && co2FilteredLines.length > 1; i++)
			{
				const linesWith1 = co2FilteredLines.filter(line => !!parseInt(line[i]));
				const linesWith0 = co2FilteredLines.filter(line => !parseInt(line[i]));
				co2FilteredLines = linesWith1.length < linesWith0.length ? linesWith1 : linesWith0;
			}
			result = parseInt(o2FilteredLines[0], 2) * parseInt(co2FilteredLines[0], 2);
		}
		console.log(`part: ${part}, result: ${result}`);
	}
}

main();