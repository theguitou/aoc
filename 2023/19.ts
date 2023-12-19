import * as fs from "fs";
import { SuperMap, SuperSet, extend, insertInSortedArray, isArray, memoize } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let [workflows,inputRatings]: any = input.split(/(?:\r?\n){2}/).map(block => block.split(/\r?\n/));
workflows = workflows.reduce((r,w) => {
	let [_,name,rules]: any = /(\w+){(.+)}/.exec(w);
	r[name] = rules.split(",").map(r => {
		let [_,left,sign,right,dest] = /(?:(\w+)(<|>)(\w+):)?(\w+)/.exec(r);
		return { left, sign, right: +right, dest };
	});
	return r;
}, {});
inputRatings = inputRatings.map((rating: string) => {
	return /{(.+)}/.exec(rating)[1].split(",").reduce((r,v) => {
		let [_,name,value] = /(\w+)=(\d+)/.exec(v);
		r[name] = +value;
		return r;
	}, {});
});

// P1
function isAccepted(rating)
{
	let node = "in";
	while (node !== "A" && node !== "R")
	{
		for (const rule of workflows[node])
		{
			let goDest = !rule.left || (
				(rule.sign === ">" && rating[rule.left] > rule.right) ||
				(rule.sign === "<" && rating[rule.left] < rule.right)
			);
			if (goDest)
			{
				node = rule.dest;
				break;
			}
		}
	}
	return node === "A";
}

let sum = 0;
for (const rating of inputRatings)
{
	if (isAccepted(rating))
	{
		sum += (Object.values(rating) as any[]).reduce((r,v) => r+v);
	}
}
console.log(sum);

// P2
const allAcceptedRatingRanges = [];
function evaluate(node, ratingRanges)
{
	if (node === "A")
	{
		allAcceptedRatingRanges.push(ratingRanges);
		return;
	}
	if (node === "R") return;

	const elseRatingRanges = extend({}, ratingRanges);
	for (const rule of workflows[node])
	{
		if (rule.left)
		{
			ratingRanges = extend({}, elseRatingRanges);
			if (rule.sign === "<")
			{
				ratingRanges[rule.left][1] = rule.right-1; // <
				elseRatingRanges[rule.left][0] = rule.right; // >=
			}
			else
			{
				ratingRanges[rule.left][0] = rule.right+1; // >
				elseRatingRanges[rule.left][1] = rule.right; // <=
			}
			evaluate(rule.dest, ratingRanges);
		}
		else
		{
			evaluate(rule.dest, elseRatingRanges);
		}
	}
}
evaluate("in", {x:[1,4000],m:[1,4000],a:[1,4000],s:[1,4000]});

sum = 0;
for (const ratingRanges of allAcceptedRatingRanges)
{
	sum += (Object.values(ratingRanges) as any[]).reduce((r,range) => r * (range[1]-range[0]+1), 1);
}
console.log(sum);
