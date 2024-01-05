
export function almostEqual(n1: number, n2: number, delta: number = 0.001)
{
	return Math.abs(n1-n2) < delta;
}
const almostEqualNumber = almostEqual;

export function ppcm(x: number, y: number)
{
	return x * y / pgcd(x, y)
}

export function ppcmx(...numbers: number[])
{
	return numbers.reduce((r, n) => ppcm(r, n), 1);
}

export function pgcd(x: number, y: number)
{
	while (y !== 0)
	{
		let temp = y;
		y = x % y;
		x = temp;
	}
	return x;
}

export function pgcdx(...numbers: number[])
{
	return numbers.reduce((r, n) => pgcd(r, n), numbers[0]);
}

export namespace vec
{
	export const add = (v1: number[], v2: number[]) => v1.map((_,i) => v1[i]+v2[i]);
	export const sub = (v1: number[], v2: number[]) => v1.map((_,i) => v1[i]-v2[i]);
	export const mul = (v: number[], f: number) => v.map((_,i) => v[i]*f);
	export const div = (v: number[], f: number) => v.map((_,i) => v[i]/f);
	export const equal = (v1: number[], v2: number[]) => v1.every((_,i) => v1[i]===v2[i]);
	export const almostEqual = (v1: number[], v2: number[], delta: number = 0.001) => v1.every((_,i) => almostEqualNumber(v1[i], v2[i], delta));
	export const manhattanDist = (v1: number[], v2: number[]) => sub(v1, v2).reduce((r,v) => r + Math.abs(v), 0);
	export const dist = (v1: number[], v2: number[]) => Math.sqrt(sub(v1, v2).reduce((r,v) => r + Math.pow(v,2), 0));
}

export type MovingPoint = { p0: number[]; v: number[] };
export const pointOnLineAt = (movPt: MovingPoint, t: number) => vec.add(vec.mul(movPt.v, t), movPt.p0);
export const xyLineEq = (movPt: MovingPoint) => [movPt.v[1]/movPt.v[0], movPt.p0[1] - movPt.v[1]/movPt.v[0]*movPt.p0[0]];
