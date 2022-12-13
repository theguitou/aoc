
type Move = {
	qty: number;
	from: number;
	to: number;
};

type ParsedInput = {
	stacks: string[][];
	moves: Move[];
};

function main(input)
{
	const parsedInput = parseInput(input);
	applyMoves(parsedInput.stacks, parsedInput.moves);

	const headCrates = parsedInput.stacks
		.map(stack => stack[0])
		.filter(crate => !!crate)
		.join("");

	console.log(headCrates);
}

enum ParsedObject {
	Stack,
	Move
}

function parseInput(input): ParsedInput
{
	let parsedObj = ParsedObject.Stack;
	const stacks = [];
	const moves = [];
	const lines = input.split("\n");
	lines.forEach(line => {
		if (parsedObj === ParsedObject.Stack && line.length === 0)
		{
			parsedObj = ParsedObject.Move;
			return;
		}
		if (parsedObj === ParsedObject.Stack)
		{
			parseStacks(line, stacks);
		}
		else
		{
			parseMoves(line, moves);
		}
	});
	return {
		stacks,
		moves
	};
}

function parseStacks(line, stacks)
{
	for (let i = 0; i < line.length; i = i+4)
	{
		const crateLetter = line[i+1];
		if ("A" <= crateLetter && crateLetter <= "Z")
		{
			const stackIdx = Math.floor((i+1)/4);
			let stack = stacks[stackIdx];
			if (!stack)
			{
				stacks[stackIdx] = stack = [];
			}
			stack.push(crateLetter);
		}
	}
}

function parseMoves(line, moves)
{
	const m = /move (\d+) from (\d+) to (\d+)/.exec(line);
	if (m)
	{
		moves.push({
			qty: parseInt(m[1]),
			from: parseInt(m[2]),
			to: parseInt(m[3])
		})
	}
}

function applyMoves(stacks: string[][], moves: Move[])
{
	moves.forEach(move => {
		const movedCrates = stacks[move.from-1].splice(0, move.qty);
		//stacks[move.to-1].splice(0, 0, ...movedCrates.reverse()); // step 1
		stacks[move.to-1].splice(0, 0, ...movedCrates); // step 2
	});
}
