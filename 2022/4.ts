
function main(input)
{
	const pairs = parseInput(input);
	let count = 0;
	pairs.forEach(pair => {
		if (pair.overlaps())
		{
			count++;
		}
	});

	console.log(count);
}

class Assignment
{
	constructor(public start: number, public end: number)
	{
	}

	get length(): number
	{
		return this.end - this.start;
	}

	overlaps(assignment: Assignment): boolean
	{
		return (this.start <= assignment.end && assignment.end <= this.end) ||
			(this.start <= assignment.start && assignment.start <= this.end);
	}

	fullyContains(assignment: Assignment): boolean
	{
		return this.start <= assignment.start && assignment.end <= this.end;
	}
}

class AssignmentPair
{
	constructor(public firstAssignment: Assignment, public secondAssignment: Assignment)
	{

	}

	oneFullyContainsTheOher(): boolean
	{
		return this.firstAssignment.fullyContains(this.secondAssignment) ||
			this.secondAssignment.fullyContains(this.firstAssignment);
	}

	overlaps(): boolean
	{
		return this.firstAssignment.overlaps(this.secondAssignment) ||
		this.secondAssignment.overlaps(this.firstAssignment);
	}
}

function parseInput(input): AssignmentPair[]
{
	return input
		.split("\n")
		.map(pair => {
			const assignments = pair
				.split(",")
				.map(assignment => {
					const ids = assignment.split("-");
					return new Assignment(parseInt(ids[0], 10), parseInt(ids[1], 10));
				});
			return new AssignmentPair(assignments[0], assignments[1]);
		});
}
