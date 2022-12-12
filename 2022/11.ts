import * as fs from "fs";

let input = fs.readFileSync('./input.txt',
// let input = fs.readFileSync('./input_test.txt',
	{encoding:'utf8', flag:'r'});

function main()
{
	const rawGrid = input.split("\n").map(line => line.split(""));
	const height = rawGrid.length;
	const width = rawGrid[0].length;

	const grid = [];
	rawGrid.forEach((line, i) =>
	{
		grid.push([]);
		line.forEach((cell, j) =>
		{
			if (cell === "S")
			{
				grid[i][j] = 1;
			}
			else if (cell === "E")
			{
				grid[i][j] = 26;
			}
			else
			{
				grid[i][j] = cell.charCodeAt(0) - "a".charCodeAt(0) + 1;
			}
		});
	});

	// steps
	[1, 2]
		.forEach(step =>
		{
			const startingPoints = [];
			grid.forEach((line, i) =>
			{
				line.forEach((cell, j) =>
				{
					if ((step === 1 && rawGrid[i][j] === "S") ||
						(step === 2 && grid[i][j] === 1))
					{
						startingPoints.push([i,j]);
					}
				});
			});

			let fewestSteps = Infinity;
			startingPoints.forEach(start =>
			{
				// BFS
				const markedNodes = new Set();
				const queue = [];
				queue.push({
					node: start,
					step: 0
				});
				markedNodes.add(`${start[0]}|${start[1]}`);
				while (queue.length > 0)
				{
					let move = queue.shift();
					if (rawGrid[move.node[0]][move.node[1]] === "E")
					{
						if (fewestSteps > move.step)
						{
							fewestSteps = move.step;
							break;
						}
					}
					for (let coords of [[-1,0],[1,0],[0,-1],[0,1]])
					{
						const ii = move.node[0] + coords[0];
						const jj = move.node[1] + coords[1];
						if (0 <= ii && ii < height && 0 <= jj && !markedNodes.has(`${ii}|${jj}`) && jj < width && (grid[ii][jj] - grid[move.node[0]][move.node[1]]) <= 1)
						{
							queue.push({
								node: [ii,jj],
								step: move.step+1
							});
							markedNodes.add(`${ii}|${jj}`);
						}
					}
				}
			});

			console.log(`step: ${step}, fewest steps: ${fewestSteps}`);
		});

	console.log("thx!");
}

main();