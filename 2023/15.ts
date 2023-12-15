import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

function hash(str)
{
	let hash = 0;
	for (let i = 0; i < str.length; i++)
	{
		hash = ((str.charCodeAt(i) + hash) * 17) % 256;
	}
	return hash;
}

let sum = 0;
const boxes = (new Array(256)).fill(null).map(_ => []);
for (const str of input.split(","))
{
	sum += hash(str);

	if (str.endsWith("-"))
	{
		const strToHash = str.replace("-", "");
		const idx = hash(strToHash);
		const box = boxes[idx];
		const idxLabel = box.findIndex(b => b[0] === strToHash);
		if (idxLabel !== -1)
		{
			box.splice(idxLabel, 1);
		}
	}
	else
	{
		const [strToHash, focal] = str.split("=");
		const idx = hash(strToHash);
		const box = boxes[idx];
		const idxLabel = box.findIndex(b => b[0] === strToHash);
		if (idxLabel !== -1)
		{
			box[idxLabel] = [strToHash, focal];
		}
		else
		{
			box.push([strToHash, focal]);
		}
	}
}
console.log(sum);

sum = 0;
boxes.forEach((box, i) =>
{
	box.forEach(([_,focal], j) =>
	{
		sum += (i+1) * (j+1) * focal;
	});
});
console.log(sum);
