import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let floor = 0;
input.split("")
	.forEach((c, i) => {
		floor += c === "(" ? 1 : -1;
	});

console.log(`part 1, floor: ${floor}`);

floor = 0;
const i = input.split("")
	.findIndex(c => {
		floor += c === "(" ? 1 : -1;
		return floor < 0;
	});

console.log(`part 2, floor: ${i+1}`);
