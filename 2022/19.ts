import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

type Blueprint = {
	id: number;
	oreRobotCost: number;
	clayRobotCost: number;
	obsidianRobotCost: number[]; // ore, clay
	geodeRobotCost: number[]; // ore, obsidian
	maxCostInOre: number;
};

const blueprints: Blueprint[] = input.split("\n")
	.map(line => {
		const m = line.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./);
		return {
			id: +m[1],
			oreRobotCost: +m[2],
			clayRobotCost: +m[3],
			obsidianRobotCost: [+m[4],+m[5]], // ore, clay
			geodeRobotCost: [+m[6],+m[7]], // ore, obsidian
			maxCostInOre: Math.max(+m[2], +m[3], +m[4], +m[6])
		};
	});

type State = {
	oreRobot: number;
	ore: number;
	clayRobot: number;
	clay: number;
	obsidianRobot: number;
	obsidian: number;
	geodeRobot: number;
	geode: number;
	time: number;
};

function canBuildGeodeRobot(state: State, blueprint: Blueprint): boolean {
	return state.ore >= blueprint.geodeRobotCost[0] && state.obsidian >= blueprint.geodeRobotCost[1];
}

function canBuildObsidianRobot(state: State, blueprint: Blueprint): boolean {
	return state.ore >= blueprint.obsidianRobotCost[0] && state.clay >= blueprint.obsidianRobotCost[1];
}

function canBuildClayRobot(state: State, blueprint: Blueprint): boolean {
	return state.ore >= blueprint.clayRobotCost;
}

function canBuildOreRobot(state: State, blueprint: Blueprint): boolean {
	return state.ore >= blueprint.oreRobotCost;
}

enum Action { Wait, BuildGeodeRobot, BuildObsidianRobot, BuildClayRobot, BuildOreRobot };

function simulate(state: State, blueprint: Blueprint, action: Action): State {
	const nextState = {...state};
	nextState.time--;
	// BUILD
	if (action === Action.BuildGeodeRobot) {
		nextState.ore -= blueprint.geodeRobotCost[0];
		nextState.obsidian -= blueprint.geodeRobotCost[1];
	}
	else if (action === Action.BuildObsidianRobot) {
		nextState.ore -= blueprint.obsidianRobotCost[0];
		nextState.clay -= blueprint.obsidianRobotCost[1];
	}
	else if (action === Action.BuildClayRobot) {
		nextState.ore -= blueprint.clayRobotCost;
	}
	else if (action === Action.BuildOreRobot) {
		nextState.ore -= blueprint.oreRobotCost;
	}

	// GET RESOURCES
	nextState.ore += state.oreRobot;
	nextState.clay += state.clayRobot;
	nextState.obsidian += state.obsidianRobot;
	nextState.geode += state.geodeRobot;

	// BUILD FINISHED
	if (action === Action.BuildGeodeRobot) {
		nextState.geodeRobot++;
	}
	else if (action === Action.BuildObsidianRobot) {
		nextState.obsidianRobot++;
	}
	else if (action === Action.BuildClayRobot) {
		nextState.clayRobot++;
	}
	else if (action === Action.BuildOreRobot) {
		nextState.oreRobot++;
	}
	return nextState;
}

function solve(state: State, blueprint: Blueprint, maxGeode: number, evaluatedStates: Set<string>): number {
	if (state.time < 0) {
		return Math.max(maxGeode, state.geode);
	}

	// limit branches: no more robot than the max cost for resources
	// Limit resource quantities according the max number of robot and per minute
	// except for geode ^^
	state.oreRobot = Math.min(state.oreRobot, blueprint.maxCostInOre);
	state.clayRobot = Math.min(state.clayRobot, blueprint.obsidianRobotCost[1]);
	state.obsidianRobot = Math.min(state.obsidianRobot, blueprint.geodeRobotCost[1]);

	state.ore = Math.min(state.ore, blueprint.maxCostInOre*state.time - state.oreRobot*(state.time-1));
	state.clay = Math.min(state.clay, blueprint.obsidianRobotCost[1]*state.time - state.clayRobot*(state.time-1));
	state.obsidian = Math.min(state.obsidian, blueprint.geodeRobotCost[1]*state.time - state.obsidianRobot*(state.time-1));

	const statePrint = JSON.stringify([state.time, state.oreRobot, state.ore, state.clayRobot, state.clay, state.obsidianRobot, state.obsidian, state.geodeRobot, state.geode]);
	if (evaluatedStates.has(statePrint)) {
		return maxGeode;
	}

	evaluatedStates.add(statePrint);

	const actions: Action[] = [];
	if (canBuildGeodeRobot(state, blueprint)) {
		actions.push(Action.BuildGeodeRobot);
	}
	if (canBuildObsidianRobot(state, blueprint)) {
		actions.push(Action.BuildObsidianRobot);
	}
	if (canBuildClayRobot(state, blueprint)) {
		actions.push(Action.BuildClayRobot);
	}
	if (canBuildOreRobot(state, blueprint)) {
		actions.push(Action.BuildOreRobot);
	}
	actions.push(Action.Wait);

	for (let action of actions) {
		const nextState = simulate(state, blueprint, action);
		maxGeode = solve(nextState, blueprint, maxGeode, evaluatedStates);
	}

	return maxGeode;
}

for (let part of [1,2]) {
	let result = part === 1 ? 0 : 1;
	for (let i = 0; i < (part === 1 ? blueprints.length : 3); i++) {
		const state: State = {
			oreRobot: 1,
			ore: 0,
			clayRobot: 0,
			clay: 0,
			obsidianRobot: 0,
			obsidian: 0,
			geodeRobot: 0,
			geode: 0,
			time: (part === 1 ? 24 : 32)-1
		};
		const maxGeode = solve(state, blueprints[i], 0, new Set());
		if (part === 1)
			result += (i+1)*maxGeode;
		else
			result *= maxGeode;
	}
	console.log(`part: ${part}, result: ${result}`);
}
