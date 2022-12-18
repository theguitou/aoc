import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

let cubes: any = input.split("\n");
const setCubes = new Set(cubes);
cubes = cubes.map(l => l.split(",").map(x => +x));

const computeFaces = [
	[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
	[[0,1,0],[1,1,0],[1,1,1],[0,1,1]],
	[[0,0,0],[1,0,0],[1,1,0],[0,1,0]],
	[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],
	[[0,0,0],[0,1,0],[0,1,1],[0,0,1]],
	[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]
];
function computeExternFaces(cubes, otherComputedExternFaces?) {
	const faceCounters = {...(otherComputedExternFaces?.faceCounters || {})};
	let externFaceCount = otherComputedExternFaces?.externFaceCount || 0;

	for (let cube of cubes) {
		for (let cpFace of computeFaces) {
			const facePoints = cpFace.map(pt => [pt[0]+cube[0],pt[1]+cube[1],pt[2]+cube[2]]);
			const facePrint = JSON.stringify(facePoints);
			let faceCount = faceCounters[facePrint];
			if (!faceCount) {
				externFaceCount++;
				faceCounters[facePrint] = 1;
			}
			else {
				if (faceCount === 1) {
					externFaceCount--;
				}
				faceCounters[facePrint] = faceCount+1;
			}
			if (otherComputedExternFaces && facePrint in otherComputedExternFaces.faceCounters) {
				externFaceCount--;
			}
		}
	}
	return {
		faceCounters,
		externFaceCount
	};
}

(() => {
	const externFacesForExistingCubes = computeExternFaces(cubes);
	console.log(`part 1, result: ${externFacesForExistingCubes.externFaceCount}`);
})();

(() => {
	// limit on each axes
	const xLimits = {};
	const yLimits = {};
	const zLimits = {};
	for (let cube of cubes) {
		for (let [limits,i,j,k] of [[xLimits,0,1,2], [yLimits,1,0,2], [zLimits,2,0,1]]) {
			const coords = `${cube[j as any]},${cube[k as any]}`;
			let limit = limits[coords];
			if (!limit) {
				limits[coords] = limit = [Infinity, -Infinity];
			}
			limit[0] = Math.min(limit[0], cube[i as any]);
			limit[1] = Math.max(limit[1], cube[i as any]);
		}
	}

	// find inside cubes
	const insideCubes = [];
	const insideCubeCounters = {};
	for (let [limits,a] of [[xLimits,0], [yLimits,1], [zLimits,2]]) {
		for (let scoords in limits) {
			const limit = limits[scoords];
			const coords = scoords.split(",").map(x => +x);
			for (let i = limit[0]+1; i < limit[1]; i++) {
				const cubeCoords = coords.slice();
				cubeCoords.splice(a as any, 0, i);
				const cubePrint = cubeCoords.join(",");
				insideCubeCounters[cubePrint] = (insideCubeCounters[cubePrint] || 0) + 1;
				// 3 times + exclude existing cubes
				if (insideCubeCounters[cubePrint] === 3 && !setCubes.has(cubePrint)) {
					insideCubes.push(cubeCoords);
				}
			}
		}
	}

	const externFacesForInsideCubes = computeExternFaces(insideCubes);
	for (let facePrint in externFacesForInsideCubes.faceCounters) {
		if (externFacesForInsideCubes.faceCounters[facePrint] !== 1) {
			delete externFacesForInsideCubes.faceCounters[facePrint];
		}
	}

	let externFacesForExistingCubes = computeExternFaces(cubes);

	const insideFaces = [];
	for (let facePrint in externFacesForInsideCubes.faceCounters) {
		if (facePrint in externFacesForExistingCubes.faceCounters) {
			insideFaces.push(facePrint);
			delete externFacesForInsideCubes.faceCounters[facePrint];
		}
	}

	// remove adjacent faces
	const sidesToRemove = [];
	for (let facePrint in externFacesForInsideCubes.faceCounters) {
		sidesToRemove.push(...JSON.parse(facePrint).map(side => JSON.stringify(side)));
	}

	while (sidesToRemove.length) {
		const sideToRemove = sidesToRemove.shift();
		insideFaces.forEach((facePrint, i) => {
			if (facePrint.indexOf(sideToRemove) !== -1) {
				sidesToRemove.push(...JSON.parse(facePrint).map(side => JSON.stringify(side)));
				insideFaces.splice(i, 1);
			}
		});
	}

	externFacesForInsideCubes.faceCounters = {};
	externFacesForInsideCubes.externFaceCount = 0;
	for (let facePrint of insideFaces) {
		externFacesForInsideCubes.faceCounters[facePrint] = 0;
	}

	externFacesForExistingCubes = computeExternFaces(cubes, externFacesForInsideCubes);

	console.log(`part 2, result: ${externFacesForExistingCubes.externFaceCount}`);
})();
