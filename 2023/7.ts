import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const cardValues = [
	{ A: "E", K: "D", Q: "C", J: "B", T: "A", "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2 },
	{ A: "E", K: "D", Q: "C", T: "A", "9": 9, "8": 8, "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2, J: 1 }
];
const types = { "5": 7, "41": 6, "32": 5, "311": 4, "221": 3, "2111": 2, "11111": 1 };

function getHandType(hand, part)
{
	const map: Record<string, number> = {};
	for (const card of hand.split(""))
	{
		let count = 0;
		if (card in map)
		{
			count = map[card];
		}
		map[card] = count + 1;
	}
	if (part === 2 && map["J"])
	{
		const sortedCards = Object.keys(map).map(c => [c, map[c]]).sort((a: any, b: any) => b[1] - a[1]);
		if (sortedCards.length > 1)
		{
			const bestCard = sortedCards[0][0] === "J" ? sortedCards[1][0] : sortedCards[0][0];
			map[bestCard] += map["J"];
			delete map["J"];
		}
	}
	const typeSignature = Object.values(map).sort((a,b) => b - a).join("");
	return types[typeSignature];
}

for (const part of [1,2])
{
	const handInfoList = [];
	for (const line of input.split("\n"))
	{
		const [hand, score] = line.split(" ");
		const type = getHandType(hand, part);
		const handValues = hand.split("").map(c => cardValues[part-1][c]);
		handInfoList.push({
			hand,
			score,
			value: `${type}${handValues.join("")}`
		});
	}
	const total = handInfoList.sort((a, b) => a.value < b.value ? -1 : 1).reduce((r, info, i) => r + ((i+1) * info.score), 0);
	console.log(total);
}
