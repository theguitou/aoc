import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const galaxies: number[][] = [];
const rowsWithGalaxy = new Set<number>();
const colsWithGalaxy = new Set<number>();
input.split("\n").forEach((line, y) =>
{
	line.split("").forEach((c, x) =>
	{
		if (c === "#")
		{
			rowsWithGalaxy.add(y);
			colsWithGalaxy.add(x);
			galaxies.push([y,x]);
		}
	});
});

function getExpansionOffset(c, set, p2)
{
	let offset = 0;
	for (let i = c; i >= 0; i--)
	{
		if (!set.has(i))
		{
			offset += p2 ? 999999 : 1;
		}
	}
	return offset;
}

for (const p2 of [false,true])
{
	const galaxiesAfterExpansion: number[][] = [];
	for (const galaxy of galaxies)
	{
		galaxiesAfterExpansion.push([
			galaxy[0]+getExpansionOffset(galaxy[0], rowsWithGalaxy, p2),
			galaxy[1]+getExpansionOffset(galaxy[1], colsWithGalaxy, p2)
		]);
	}
	let sum = 0;
	for (let i = 0; i < galaxiesAfterExpansion.length; i++)
	{
		for (let j = i+1; j < galaxiesAfterExpansion.length; j++)
		{
			sum += Math.abs(galaxiesAfterExpansion[i][0] - galaxiesAfterExpansion[j][0]) + Math.abs(galaxiesAfterExpansion[i][1] - galaxiesAfterExpansion[j][1]);
		}
	}
	console.log(sum);
}
