import { range } from "./tools";

for (const p of [40,50])
{
	let input = "1113122113";
	for (const _ of range(0,p))
	{
		let nextInput = [];
		let lastDigit = -1;
		let lastDigitCount = 0;
		for (const c of input)
		{
			const digit = +c;
			if (lastDigit === digit)
			{
				lastDigitCount++;
			}
			else
			{
				if (lastDigit !== -1)
				{
					nextInput.push(...[lastDigitCount, lastDigit]);
				}
				lastDigit = digit;
				lastDigitCount = 1;
			}
		}
		nextInput.push(...[lastDigitCount, lastDigit]);
		input = nextInput.join("");
	}
	console.log(input.length);
}
