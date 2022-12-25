import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const nums = [];
input.split("\n")
	.forEach(line => {
		let num = 0;
		line.split("")
			.reverse()
			.forEach((c, i) => {
				const pow = Math.pow(5, i);
				let factor = 0;
				if (c === "=") {
					factor = -2;
				}
				else if (c === "-") {
					factor = -1;
				}
				else {
					factor = +c;
				}
				num += factor * pow;
			})
		nums.push(num);
	})

const sum = nums.reduce((s, x) => s+x);

const snafuSum = [];
let quotient = sum, rest;
while (quotient > 1) {
	rest = quotient%5;
	quotient = quotient/5;

	let c: any = 0;
	if (rest === 4) {
		c = "-";
		quotient = Math.ceil(quotient);
	}
	else if (rest === 3) {
		c = "=";
		quotient = Math.ceil(quotient);
	}
	else {
		c = rest;
		quotient = Math.floor(quotient);
	}
	snafuSum.splice(0, 0, c);
}

console.log(`sum: ${snafuSum.join("")}`);
