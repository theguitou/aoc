import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const [times, distances] = input.split("\n").map(line => [...line.matchAll(/\d+/g)].map(m => +m[0]));

function countVictory(time, goalDist)
{
	let count = 0;
	for (let n = 0; n <= time; n++)
	{
		const distance = (time - n) * n;
		if (distance > goalDist)
		{
			count++;
		}
	}
	return count;
}

let sum = 1;
for (let i = 0; i < times.length; i++)
{
	const victory = countVictory(times[i], distances[i]);
	sum *= (victory || 1);
}
console.log(sum);

const superVictory = countVictory(+times.join(""), +distances.join(""));
console.log(superVictory);
