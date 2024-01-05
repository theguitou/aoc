import * as fs from "fs";
import { MovingPoint, almostEqual, pointOnLineAt, xyLineEq } from "./math";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

const hailstones: MovingPoint[] = input.split(/\r?\n/)
	.map(line => {
		const [_,x,y,z,vx,vy,vz] = /(-?\d+),\s+(-?\d+),\s+(-?\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)/.exec(line);
		return { p0: [+x,+y,+z], v: [+vx,+vy,+vz] };
	});
const hailstonesEq = hailstones.map(movPt => xyLineEq(movPt));

// PART ONE
const min = 200000000000000; //7;
const max = 400000000000000; //27;

let p1_count = 0;
for (let i = 0; i < hailstones.length-1; i++)
{
	for (let j = i+1; j < hailstones.length; j++)
	{
		const p1 = hailstones[i];
		const eq1 = hailstonesEq[i];
		const p2 = hailstones[j];
		const eq2 = hailstonesEq[j];
		const x = (eq2[1]-eq1[1])/(eq1[0]-eq2[0]);
		if (min <= x && x <= max && 
			((p1.v[0] <= 0 && x <= p1.p0[0]) || (p1.v[0] >= 0 && x >= p1.p0[0])) &&
			((p2.v[0] <= 0 && x <= p2.p0[0]) || (p2.v[0] >= 0 && x >= p2.p0[0])))
		{
			const y = eq1[0]*x+eq1[1];
			if (min <= y && y <= max && 
				((p1.v[1] <= 0 && y <= p1.p0[1]) || (p1.v[1] >= 0 && y >= p1.p0[1])) &&
				((p2.v[1] <= 0 && y <= p2.p0[1]) || (p2.v[1] >= 0 && y >= p2.p0[1])))
			{
				p1_count++;
			}
		}
	}
}

console.log(p1_count);

// PART TWO
// Après avoir observer les distances entre les points au cours du temps, la recherche va s'axer sur la vitesse plutôt que le temps.
// L'idée est de prendre 2 points et chercher le T pour le point de référence en testant différente vitesse. Pour éviter un trop grand
// nombre de combinaisons de vitesse, on cherche d'abord sur le plan XY et ensuite pour les candidats avec un autre point, on recherche sur Z.
// A noter que les données de démo (très grand nombre) fait qu'on doit approximer les valeurs (contrairement à l'exemple où ca tombe juste)
// soit movPts pierre, movPt1/2 grêlons
// Le système: à T pour le pt 1 et T+N pour le pt 2
//       [movPts.v*(T+N) + movPts.p0] - [movPts.v*T + movPts.p0] = [movPt2.v*(T+N) + movPt2.p0] - [movPt1.v*T + movPt1.p0]
// d'où  movPts.v*N = (movPt2.v - movPt1.v)*T + movPt2.v*N + movPt2.p0 - movPt1.p0
// d'où  (movPts.v - movPt2.v)*N = (movPt2.v - movPt1.v)*T + movPt2.p0 - movPt1.p0
// On fait le rapport entre X et Y pour enlever N et se exprimer T :
//       (movPts.vx - movPt2.vx)*N   (movPt2.vx - movPt1.vx)*T + movPt2.p0x - movPt1.p0x
//       ------------------------- = ---------------------------------------------------
//       (movPts.vy - movPt2.vy)*N   (movPt2.vy - movPt1.vy)*T + movPt2.p0y - movPt1.p0y
//
// on pose a=movPts.vx - movPt2.vx | b=movPts.vy - movPt2.vy | c=movPt2.vx - movPt1.vx | d=movPt2.vy - movPt1.vy | e=movPt2.p0x - movPt1.p0x | f=movPt2.p0y - movPt1.p0y
// d'où  a/b = (c*T + e)/(d*T + f)
// d'où  T = (b*e - a*f)/(a*d - c*b)

function computeT(vs: number[], movPt1: MovingPoint, movPt2: MovingPoint, c1: number, c2: number)
{
	const a = vs[c1]-movPt2.v[c1];
	const b = vs[c2]-movPt2.v[c2];
	const c = movPt2.v[c1]-movPt1.v[c1];
	const d = movPt2.v[c2]-movPt1.v[c2];
	const e = movPt2.p0[c1]-movPt1.p0[c1];
	const f = movPt2.p0[c2]-movPt1.p0[c2];
	return (b*e - a*f) / (a*d - c*b);
}

let foundOnXY = [];
for (let vx = -1000; vx <= 1000; vx++)
{
	for (let vy = -1000; vy <= 1000; vy++)
	{
		const vs = [vx,vy,0];
		const T2_xy = computeT(vs, hailstones[2], hailstones[1], 0, 1);
		if (T2_xy > 0 && almostEqual(T2_xy, Math.round(T2_xy)))
		{
			const T100_xy = computeT(vs, hailstones[2], hailstones[100], 0, 1); // check another point
			if (almostEqual(T2_xy, T100_xy))
			{
				foundOnXY.push([Math.round(T2_xy), vs]);
			}
		}
	}
}

let foundOnXYZ = null;
for (const [t,vs] of foundOnXY)
{
	for (let vz = -1000; vz <= 1000; vz++)
	{
		vs[2] = vz;
		const T2_xyz = computeT(vs, hailstones[2], hailstones[50], 0, 2);
		if (almostEqual(T2_xyz, t))
		{
			foundOnXYZ = [T2_xyz, vs];
			break;
		}
	}
}

// found stone throw origin
const ps0 = pointOnLineAt(hailstones[2], foundOnXYZ[0]).map((p,i) => p - foundOnXYZ[1][i]*foundOnXYZ[0]);
const sum = ps0.reduce((r,v) => r+v);
console.log(sum);
