import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const startingSequences: number[][] = [];
for (const line of input.split("\n"))
{
	const seq = line.split(" ").map(n => +n);
	startingSequences.push(seq);
}

function subSequence(seq)
{
	const subSeq: number[] = [];
	for (let i = 1; i < seq.length; i++)
	{
		subSeq.push(seq[i]-seq[i-1]);
	}
	return subSeq;
}

for (const part of [1,2])
{
	let sum = 0;
	for (let seq of startingSequences)
	{
		const lastNums = [seq[part === 1 ? (seq.length-1) : 0]];
		while (!seq.every(n => !n))
		{
			seq = subSequence(seq);
			lastNums.splice(0, 0, seq[part === 1 ? (seq.length-1) : 0]);
		}
		let nextNum = 0;
		for (const num of lastNums)
		{
			nextNum = num + (part === 1 ? 1 : -1) * nextNum;
		}
		sum += nextNum;
	}
	console.log(sum);
}
