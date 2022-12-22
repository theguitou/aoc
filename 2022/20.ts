import * as fs from "fs";

let input = fs.readFileSync('./input.txt', {encoding:'utf8', flag:'r'});
// let input = fs.readFileSync('./input_test.txt', {encoding:'utf8', flag:'r'});

type Node = {
	number: number;
	prev: Node;
	next: Node;
};

for (let part of [1,2]) {
	let firstNode: Node = null, lastNode: Node = null, zeroNode: Node = null;
	let decryptKey = part === 1 ? 1 : 811589153;
	const nodes = input.split("\n")
		.map(x => +x*decryptKey)
		.map(number => {
			const node: Node = {
				number,
				prev: lastNode,
				next: null
			};
			if (!firstNode) {
				firstNode = node;
			}
			if (lastNode) {
				lastNode.next = node;
			}
			if (number === 0) {
				zeroNode = node;
			}
			return lastNode = node;
		});

	firstNode.prev = lastNode;
	lastNode.next = firstNode;
	
	const nbItr = part === 1 ? 1 : 10;
	for (let itr = 0; itr < nbItr; itr++) {
		for (let node of nodes) {
			if (!node.number) {
				continue;
			}
			// remove from chain
			node.prev.next = node.next;
			node.next.prev = node.prev;
			// find new node place
			let newNode = node;
			const prop = node.number < 0 ? "prev" : "next";
			const invprop = node.number < 0 ? "next" : "prev";
			const n = Math.abs(node.number) % (nodes.length-1);
			for (let i = 0; i < n; i++) {
				newNode = newNode[prop];
			}
			// insert
			const neighborNewNode = newNode[prop];
			newNode[prop] = node;
			node[invprop] = newNode;
			node[prop] = neighborNewNode;
			neighborNewNode[invprop] = node;
		}
	}

	const changedNodesFrom0 = [zeroNode];
	for (let n = zeroNode.next; n !== zeroNode; n = n.next) {
		changedNodesFrom0.push(n);
	}
	
	const sum = [1000,2000,3000].reduce((s, i) => s + changedNodesFrom0[i%changedNodesFrom0.length].number, 0);
	console.log(`part: ${part}, sum: ${sum}`);
}
