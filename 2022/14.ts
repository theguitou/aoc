import * as fs from "fs";

// let input = fs.readFileSync('./input.txt',
let input = fs.readFileSync('./input_test.txt',
	{encoding:'utf8', flag:'r'});

let grid, bounds;

function parseInput()
{
	grid = [];
	const paths = input.split("\n");
	// left, right, bottom
	bounds = [Infinity, -1, -Infinity];
	for (let path of paths)
	{
		const points = path.split(" -> ");
		for (let i = 0; i < points.length-1; i++)
		{
			const a = points[i].split(",").map(x => parseInt(x));
			const b = points[i+1].split(",").map(x => parseInt(x));
			// horizontal
			if (a[1] === b[1])
			{
				grid[a[1]] = grid[a[1]] || [];
				const xs = Math.min(a[0], b[0]);
				const xe = Math.max(a[0], b[0]);
				for (let n = xs; n < xe+1; n++)
				{
					grid[a[1]][n] = "#";
				}
				bounds[0] = Math.min(bounds[0], xs);
				bounds[1] = Math.max(bounds[1], xs);
				bounds[2] = Math.max(bounds[2], a[1]);
			}
			else
			{
				const ys = Math.min(a[1], b[1]);
				const ye = Math.max(a[1], b[1]);
				for (let n = ys; n < ye+1; n++)
				{
					grid[n] = grid[n] || [];
					grid[n][a[0]] = "#";
				}
				bounds[0] = Math.min(bounds[0], a[0]);
				bounds[1] = Math.max(bounds[1], a[0]);
				bounds[2] = Math.max(bounds[2], ye);
			}
		}
	}
}

function main()
{
	for (let part of [1, 2])
	{
		parseInput();

		let result;
		if (part === 1)
		{
			// simulate sand
			let flowing = false;
			let n = 0;
			for (; !flowing; n++)
			{
				const unit = [500,0];
				let hasMoved;
				do
				{
					hasMoved = false;
					for (let move of [[0,1],[-1,1],[1,1]])
					{
						let nextUnit = [unit[0]+move[0], unit[1]+move[1]];
						grid[nextUnit[1]] = grid[nextUnit[1]] || [];
						if (!grid[nextUnit[1]][nextUnit[0]])
						{
							unit[0] = nextUnit[0];
							unit[1] = nextUnit[1];
							hasMoved = true;
							break;
						}
					}
					if (hasMoved)
					{
						// check limit
						if (unit[0] < bounds[0] || unit[0] > bounds[1] || unit[1] > bounds[2])
						{
							flowing = true
						}
					}
					else
					{
						grid[unit[1]][unit[0]] = "o";
					}
				}
				while (hasMoved && !flowing)
			}
			result = n-1;
		}
		else
		{
			// simulate sand
			let stop = false;
			let n = 0;
			for (; !stop; n++)
			{
				const unit = [500,0];
				let hasMoved;
				let firstMove = true;
				do
				{
					hasMoved = false;
					for (let move of [[0,1],[-1,1],[1,1]])
					{
						let nextUnit = [unit[0]+move[0], unit[1]+move[1]];
						grid[nextUnit[1]] = grid[nextUnit[1]] || [];
						if (!grid[nextUnit[1]][nextUnit[0]] && nextUnit[1] < (bounds[2]+2))
						{
							unit[0] = nextUnit[0];
							unit[1] = nextUnit[1];
							hasMoved = true;
							break;
						}
					}
					if (!hasMoved)
					{
						if (firstMove)
						{
							stop = true;
						}
						else
						{
							grid[unit[1]][unit[0]] = "o";
						}
					}
					firstMove = false;
				}
				while (hasMoved && !stop)
			}
			result = n;
		}
		console.log(`part: ${part}, result: ${result}`);
	}
}

main();