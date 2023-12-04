import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const lines = input.split("\n");

const sums = [0, 0];
const nbInstances = [];
for (let i = 0; i < lines.length; i++)
{
	const line = lines[i];
	const [winningNums, myNums] = line.split(":")[1].split("|").map(numbers => numbers.split(" ").filter(n => !!n).map(n => +n));
	let nbWin = winningNums.filter(n => myNums.indexOf(n) !== -1).length;
	for (let j = 1; j <= nbWin; j++)
	{
		nbInstances[i+j] = (nbInstances[i+j] || 0) + (nbInstances[i] || 0) + 1;
	}
	sums[0] += nbWin ? Math.pow(2, nbWin-1) : 0;
	sums[1] += (nbInstances[i] || 0) + 1;
}
console.log(sums);
