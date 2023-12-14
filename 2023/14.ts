import * as fs from "fs";
import { extend, memoize } from "./tools";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let grid = input.split("\n").map(line => line.split(""));

type Direction = "north" | "east" | "south" | "west";
function simulate(grid: string[][], direction: Direction)
{
	grid = extend([], grid);

	if (direction === "north" || direction === "south")
	{
		// by column
		for (let j = 0; j < grid[0].length; j++)
		{
			let freeIdx = direction === "north" ? Number.MAX_SAFE_INTEGER : -1;
			for (let _i = 0; _i < grid.length; _i++)
			{
				let i = direction === "north" ? _i : (grid.length-_i-1);
				if (grid[i][j] === ".")
				{
					freeIdx = direction === "north" ? Math.min(freeIdx, i) : Math.max(freeIdx, i);
				}
				else if (grid[i][j] === "#")
				{
					freeIdx = direction === "north" ? Number.MAX_SAFE_INTEGER : -1;
				}
				else if (grid[i][j] === "O" && (direction === "north" ? (freeIdx < i) : (freeIdx > i)))
				{
					grid[i][j] = ".";
					grid[freeIdx][j] = "O";
					freeIdx += direction === "north" ? 1 : -1;
				}
			}
		}
	}
	else
	{
		// by row
		for (let i = 0; i < grid.length; i++)
		{
			let freeIdx = direction === "west" ? Number.MAX_SAFE_INTEGER : -1;
			for (let _j = 0; _j < grid[0].length; _j++)
			{
				let j = direction === "west" ? _j : (grid[0].length-_j-1);
				if (grid[i][j] === ".")
				{
					freeIdx = direction === "west" ? Math.min(freeIdx, j) : Math.max(freeIdx, j);
				}
				else if (grid[i][j] === "#")
				{
					freeIdx = direction === "west" ? Number.MAX_SAFE_INTEGER : -1;
				}
				else if (grid[i][j] === "O" && (direction === "west" ? (freeIdx < j) : (freeIdx > j)))
				{
					grid[i][j] = ".";
					grid[i][freeIdx] = "O";
					freeIdx += direction === "west" ? 1 : -1;
				}
			}
		}
	}
	return grid;
}

const doOneCycle = memoize(function(grid)
{
	for (const dir of ["north", "west", "south", "east"])
	{
		grid = simulate(grid, dir as Direction);
	}
	return grid;
}, [0], true);

function computeTotalLoad(grid)
{
	let sum = 0;
	for (let i = 0; i < grid.length; i++)
	{
		for (let j = 0; j < grid[0].length; j++)
		{
			if (grid[i][j] === "O")
			{
				sum += (grid.length-i);
			}
		}
	}
	return sum;
}

// mettre au propre :
// input test : (1000000000-(11-7))%7+3
// input : (1000000000-(180-26))%26+153
for (let i = 0; i < 100000; i++)
{
	console.log("cycle " + (i+1));
	grid = doOneCycle(grid);
}
console.log(computeTotalLoad(grid));


//console.log(newGrid.map(line => line.join("")).join("\n"));