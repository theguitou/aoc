import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let boxes = []
for (let line of input.split("\n")) {
	boxes.push(line.split("x").map(x => +x).sort((a,b) => a-b));
}

let sum = 0;
for (let box of boxes) {
	sum += 3*box[0]*box[1] + 2*box[0]*box[2] + 2*box[1]*box[2];
}

console.log(`part 1, sum: ${sum}`);

let length = 0;
for (let box of boxes) {
	length += 2*box[0] + 2*box[1] + box[0]*box[1]*box[2];
}

console.log(`part 2, length: ${length}`);
