import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const grid: string[/*row*/][/*col*/] = input.split("\n").map(line => line.split(""));

// find animal
let animalPos;
for (let i = 0; i < grid.length; i++)
{
	for (let j = 0; j < grid[0].length; j++)
	{
		if (grid[i][j] === "S")
		{
			animalPos = [i,j];
			break;
		}
	}
}

type Direction = "bottom"|"top"|"left"|"right";
const dirToOffset: Record<Direction, number[]> = { "bottom": [1,0], "top": [-1,0], "left": [0,-1], "right": [0,1] };

function getPos(pos, dir)
{
	const r = pos[0]+dirToOffset[dir][0];
	const c = pos[1]+dirToOffset[dir][1];
	return (0 <= r && r < grid.length && 0 <= c && c < grid[0].length) ? [r,c,dir] : null;
}

function moveInPipe(pos)
{
	let nextDir: Direction = null;
	const pipe = grid[pos[0]][pos[1]];
	if (pos[2] === "top" && pipe === "F") nextDir = "right";
	else if (pos[2] === "top" && pipe === "7") nextDir = "left";
	else if (pos[2] === "top" && pipe === "|") nextDir = "top";
	else if (pos[2] === "bottom" && pipe === "L") nextDir = "right";
	else if (pos[2] === "bottom" && pipe === "J") nextDir = "left";
	else if (pos[2] === "bottom" && pipe === "|") nextDir = "bottom";
	else if (pos[2] === "right" && pipe === "J") nextDir = "top";
	else if (pos[2] === "right" && pipe === "7") nextDir = "bottom";
	else if (pos[2] === "right" && pipe === "-") nextDir = "right";
	else if (pos[2] === "left" && pipe === "F") nextDir = "bottom";
	else if (pos[2] === "left" && pipe === "L") nextDir = "top";
	else if (pos[2] === "left" && pipe === "-") nextDir = "left";
	return nextDir && getPos(pos, nextDir);
}

// find loop
let theLoop = null;
for (const dir of ["right","left","bottom","top"])
{
	const loop = new Set<string>();
	loop.add(`${animalPos[0]}|${animalPos[1]}`);
	let pos = getPos(animalPos, dir);
	while (pos && !(animalPos[0] === pos[0] && animalPos[1] === pos[1]))
	{
		loop.add(`${pos[0]}|${pos[1]}`);
		pos = moveInPipe(pos);
	}
	if (pos)
	{
		if ((dir === "right" && pos[2] === "top") || (dir === "bottom" && pos[2] === "left")) grid[pos[0]][pos[1]] = "F";
		else if ((dir === "right" && pos[2] === "bottom") || (dir === "top" && pos[2] === "left")) grid[pos[0]][pos[1]] = "L";
		else if ((dir === "bottom" && pos[2] === "right") || (dir === "left" && pos[2] === "top")) grid[pos[0]][pos[1]] = "7";
		else if ((dir === "top" && pos[2] === "right") || (dir === "left" && pos[2] === "bottom")) grid[pos[0]][pos[1]] = "J";
		theLoop = loop;
		break;
	}
}

console.log(Math.ceil(theLoop.size/2));

function isInside(pos): boolean
{
	let intersect = 0;
	let bendPipe = null;
	for (let c = 0; c < pos[1]; c++)
	{
		if (theLoop.has(`${pos[0]}|${c}`))
		{
			const pipe = grid[pos[0]][c];
			if (pipe === "|")
			{
				intersect++;
			}
			else if (bendPipe === null && (pipe === "L" || pipe === "F"))
			{
				bendPipe = pipe;
			}
			else if ((bendPipe === "L" && pipe === "7") || (bendPipe === "F" && pipe === "J"))
			{
				intersect++;
				bendPipe = null;
			}
			else if ((bendPipe === "L" && pipe === "J") || (bendPipe === "F" && pipe === "7"))
			{
				intersect += 2;
				bendPipe = null;
			}
		}
	}
	return !!(intersect%2);
}

let sum = 0;
for (let i = 0; i < grid.length; i++)
{
	for (let j = 0; j < grid[0].length; j++)
	{
		if (!theLoop.has(`${i}|${j}`) && isInside([i,j]))
		{
			sum++;
		}
	}
}

console.log(sum);