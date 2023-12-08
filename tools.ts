
export function getRandom(min: number, max: number): number
{
	return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number): number
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ppcm(x: number, y: number)
{
	return x * y / pgcd(x, y)
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

export function swap(items, leftIndex, rightIndex)
{
	var temp = items[leftIndex];
	items[leftIndex] = items[rightIndex];
	items[rightIndex] = temp;
}

export function partition(items, left, right)
{
	var pivot = items[Math.floor((right + left) / 2)], //middle element
		i = left, //left pointer
		j = right; //right pointer
	while (i <= j)
	{
		while (items[i] < pivot)
		{
			i++;
		}
		while (items[j] > pivot)
		{
			j--;
		}
		if (i <= j)
		{
			swap(items, i, j); //sawpping two elements
			i++;
			j--;
		}
	}
	return i;
}

export function quickSort(items, left, right)
{
	var index;
	if (items.length > 1)
	{
		index = partition(items, left, right); //index returned from partition
		if (left < index - 1)
		{ //more elements on the left side of the pivot
			quickSort(items, left, index - 1);
		}
		if (index < right)
		{ //more elements on the right side of the pivot
			quickSort(items, index, right);
		}
	}
	return items;
}

export class SuperSet<T> {
	private internal = new Set<string>();

	public add(value: T): this
	{
		this.internal.add(JSON.stringify(value));
		return this;
	}

	public clear(): void
	{
		this.internal.clear();
	}

	public delete(value: T): boolean
	{
		return this.internal.delete(JSON.stringify(value));
	}

	public forEach(callbackfn: (value: T, value2: T, set: SuperSet<T>) => void, thisArg?: any): void
	{
		this.internal.forEach((value, value2) => {
			callbackfn.call(thisArg, JSON.parse(value), JSON.parse(value2), this);
		})
	}

	public has(value: T): boolean
	{
		return this.internal.has(JSON.stringify(value));
	}

	public get size(): number
	{
		return this.internal.size;
	}

	public [Symbol.iterator]()
	{
		const values = this.internal.values();
		return {
			next()
			{
				const next = values.next();
				if (!next.done) {
					return { value: JSON.parse(next.value), done: false };
				}
				return { value: undefined, done: true };
			}
		};
	}
}

export class SuperMap<K, V>
{
	private internal = new Map<string, V>();

	public clear(): void
	{
		this.internal.clear();
	}

	public delete(key: K): boolean
	{
		return this.internal.delete(JSON.stringify(key));
	}

	public forEach(callbackfn: (value: V, key: K, map: SuperMap<K, V>) => void, thisArg?: any): void
	{
		this.internal.forEach((value, key) => {
			callbackfn.call(thisArg, value, JSON.parse(key), this);
		})
	}

	public get(key: K): V | undefined
	{
		return this.internal.get(JSON.stringify(key));
	}

	public has(key: K): boolean
	{
		return this.internal.has(JSON.stringify(key));
	}

	public set(key: K, value: V): this
	{
		this.internal.set(JSON.stringify(key), value);
		return this;
	}

	public get size(): number
	{
		return this.internal.size;
	}

	public [Symbol.iterator]()
	{
		const entries = this.internal.entries();
		return {
			next()
			{
				const next = entries.next();
				if (!next.done) {
					return { value: [JSON.parse(next.value[0]), next.value[1]], done: false };
				}
				return { value: undefined, done: true };
			}
		};
	}
}


// function sortNFirst(list: any[], n: number, comparison?: (a: any, b: any) => number)
// {
// 	comparison = comparison || ((a, b) => a - b);

// 	let lastNSorted = 0;
// 	let maxOfNSorted = null;
// 	let len = list.length - 1;
// 	for (let i = 0; i < len; i++)
// 	{
// 		let a = list[lastNSorted];
// 		let b = list[i + 1];
// 		let cmp = comparison(a, b);
// 		if (cmp > 0)
// 		{
// 			list[lastNSorted] = b;
// 			list[i + 1] = a;
// 		}

// 		if ((lastNSorted + 1) < n)
// 		{
// 			lastNSorted++;
// 			if (comparison(maxOfNSorted, list[lastNSorted]) < 0)
// 			{
// 				maxOfNSorted = 
// 			}
// 		}
// 	}

// 	quickSort(list, 0, lastNSorted);
// }
