import * as fs from "fs";
import { SuperMap, SuperSet } from "./tools";

let input = fs.readFileSync('./input.txt', { encoding: 'utf8', flag: 'r' });
//let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

// Alors j'ai passé beaucoup de temps à chercher pleins de solution. En général ca fonctionnait
// avec l'exemple mais jamais avec les données de l'énigme...
// Au final, j'ai regardé la fréquence de passage sur chaque connexion sur un certain nombre de 
// noeud. Je choisis les noeuds pour lesquels il n'existe pas de connexion directe.
// Il faut que je teste la théorie là dessus. C'est quelque chose d'assez std.

const connectionsByNode = new SuperMap<string, SuperSet<string>>();
const connections = new SuperSet<string[]>();
function co(node1, node2)
{
	return [node1, node2].sort();
}
function connect(node1, node2, connectionsByNode, connections?)
{
	connectionsByNode.set(node1, (connectionsByNode.get(node1) || new SuperSet()).add(node2));
	connectionsByNode.set(node2, (connectionsByNode.get(node2) || new SuperSet()).add(node1));
	connections?.add(co(node1, node2));
}
function disconnect(node1, node2, connectionsByNode, connections?)
{
	connectionsByNode.get(node1).delete(node2);
	connectionsByNode.get(node2).delete(node1);
	connections?.delete(co(node1, node2));
}
// get connections
for (const line of input.split(/\r?\n/))
{
	const [main, rawNodes] = line.split(": ");
	const nodes = rawNodes.split(" ");
	for (const node of nodes)
	{
		connect(main, node, connectionsByNode, connections);
	}
}

function getPath(node1, node2, connectionsByNode)
{
	let foundPath = null;
	const visited = new Set();
	const queue = [];
	queue.push(...[...connectionsByNode.get(node1)].map(n => [n, node1]));
	while (queue.length)
	{
		const nodePath = queue.shift();
		const node = nodePath[0];
		if (visited.has(node))
		{
			continue;
		}
		visited.add(node);

		const coNodes = connectionsByNode.get(node);
		if (coNodes)
		{
			if (coNodes.has(node2))
			{
				foundPath = nodePath;
				nodePath.splice(0, 0, node2);
				break;
			}
			for (const noNode of coNodes)
			{
				const newPath = nodePath.slice();
				newPath.splice(0, 0, noNode);
				queue.push(newPath);
			}
		}
	}
	return foundPath;
}

function getGroupLengths(connections)
{
	let groupLengths = [];
	while (connections.size)
	{
		const visited = new Set();
		let queue = [];
		queue.push([...connections.keys()][0]);
		while (queue.length && connections.size)
		{
			const node = queue.shift();
			if (visited.has(node))
			{
				continue;
			}
			visited.add(node);

			const coNodes = connections.get(node);
			if (coNodes)
			{
				queue.push(...coNodes);
				connections.delete(node)
			}
		}
		groupLengths.push(visited.size);
	}
	return groupLengths;
}

const frequencyByConnection = new SuperMap<number[], number>();
const nodes = [...connectionsByNode.keys()];
const nbNodesToTest = 200;
for (let i = 0; i < nbNodesToTest-1; i++)
{
	const node1 = nodes[i];
	for (let j = i+1; j < nbNodesToTest; j++)
	{
		const node2 = nodes[j];
		if (node1 !== node2 && !connections.has([node1, node2].sort()))
		{
			const path = getPath(node1, node2, connectionsByNode.clone());
			for (let k = 0; k < path.length-1; k++)
			{
				const key = [path[k], path[k+1]].sort();
				frequencyByConnection.set(key, (frequencyByConnection.get(key) || 0)+1);
			}
		}
	}
}

const sortedFreqConnections = [...frequencyByConnection].sort((a,b) => b[1]-a[1]);
const mostFreqConnections = sortedFreqConnections.slice(0, 3).map(o => o[0]);
for (const connection of mostFreqConnections)
{
	disconnect(connection[0], connection[1], connectionsByNode);
}
const groupLengths = getGroupLengths(connectionsByNode);
console.log(groupLengths[0]*groupLengths[1]);
