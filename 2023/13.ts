import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

function countError(line1, line2)
{
	return line1.split("").filter((c1, i) => c1 !== line2[i]).length;
}

function findReflexionLineIndex(lines, ignoredLine: number = null, allowedNbError: number = 0): number
{
	for (let i = 0; i < lines.length; i++)
	{
		if (ignoredLine === (i-1)) continue;
		let nbError = countError(lines[i], lines[i-1] || "");
		if (nbError <= allowedNbError)
		{
			let reflexion = true;
			for (let i1 = i-2, i2 = i+1; i1 >= 0 && i2 < lines.length && reflexion; i1--, i2++)
			{
				nbError += countError(lines[i1], lines[i2]);
				reflexion = nbError <= allowedNbError;
			}
			if (reflexion)
			{
				return i-1;
			}
		}
	}
	return null;
}

let sums = [0,0];
for (const pattern of input.split("\n\n"))
{
	const rows = pattern.split("\n");
	const cols = (new Array(rows[0].length)).fill("");
	rows.forEach((row, i) =>
	{
		for (let j = 0; j < row.length; j++)
		{
			cols[j] += row[j];
		}
	});

	let perfectResult: any[] = [findReflexionLineIndex(rows),"horizontal"];
	if (perfectResult[0] === null)
	{
		perfectResult = [findReflexionLineIndex(cols),"vertical"];
	}

	sums[0] += (perfectResult[1] === "horizontal" ? 100 : 1) * (perfectResult[0]+1);

	let unperfectResult: any[] = [findReflexionLineIndex(rows, perfectResult[1] === "horizontal" ? perfectResult[0] : null, 1), "horizontal"];
	if (unperfectResult[0] === null)
	{
		unperfectResult = [findReflexionLineIndex(cols, perfectResult[1] === "vertical" ? perfectResult[0] : null, 1), "vertical"];
	}

	sums[1] += (unperfectResult[1] === "horizontal" ? 100 : 1) * (unperfectResult[0]+1);
}
console.log(sums);
