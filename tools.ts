
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

	public clone(): SuperSet<T>
	{
		const clone = new SuperSet<T>();
		for (const key of this)
		{
			clone.add(key);
		}
		return clone;
	}

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
		this.internal.forEach((value, value2) =>
		{
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
				if (!next.done)
				{
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

	public clone(): SuperMap<K, V>
	{
		const clone = new SuperMap<K, V>();
		for (let [key, value] of this)
		{
			if (isFunction(value.clone))
			{
				value = value.clone();
			}
			else if (isArray(value))
			{
				value = extend([], value);
			}
			else if (isPlainObject(value))
			{
				value = extend({}, value);
			}
			clone.set(key, value);
		}
		return clone;
	}

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
		this.internal.forEach((value, key) =>
		{
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

	public keys(): K[]
	{
		return [...this.internal.keys()].map(k => JSON.parse(k));
	}

	public [Symbol.iterator]()
	{
		const entries = this.internal.entries();
		return {
			next()
			{
				const next = entries.next();
				if (!next.done)
				{
					return { value: [JSON.parse(next.value[0]), next.value[1]], done: false };
				}
				return { value: undefined, done: true };
			}
		};
	}
}

export function size(obj: any)
{
	if (obj)
	{
		if (isDefined(obj.length))
		{
			return obj.length;
		}
		if (isFunction(obj.size))
		{
			return obj.size();
		}
		if (isPlainObject(obj))
		{
			let count = 0;
			for (const _ of enumerate(obj))
			{
				count++;
			}
			return count;
		}
	}
	return 0;
}

class Enumeration
{
	constructor(public obj: Record<string, any>)
	{
		this.obj = obj;
	}
	*[Symbol.iterator]()
	{
		const anArray = isArray(this.obj);
		for (const key in this.obj)
		{
			if (hasOwn.call(this.obj, key))
			{
				yield [anArray ? +key : key,this.obj[key]];
			}
		}
	}
}
//export const enumerate = (obj) => new Enumeration(obj);
export const enumerate = (...args) => new (Function.prototype.bind.apply(Enumeration, [null].concat(args)))();

class Range
{
	private array: any[];
	private start: number;
	private end: number;
	private step: number;

	constructor(start: number, end: number, step: number);
	constructor(array: any[], start: number, end: number, step: number);
	constructor(...args: any[])
	{
		let startArgIdx = 0;
		if (isArray(args[0]))
		{
			this.array = args[0];
			startArgIdx = 1;
		}
		this.start = args[startArgIdx];
		this.end = args[startArgIdx+1];
		this.step = args[startArgIdx+2] || (this.start <= this.end ? 1 : -1);
	}

	*[Symbol.iterator]()
	{
		for (let i = this.start; this.step > 0 ? i < this.end : i > this.end; i += this.step)
		{
			yield (this.array ? this.array[i] : i);
		}
	}
}
export const range = (...args) => new (Function.prototype.bind.apply(Range, [null].concat(args)))();

export function binarySearch(arr: any[], element: any, predicate?: (a,b) => number, start?: number, end?: number)
{
	if (start === undefined) start = 0;
	if (end === undefined) end = arr.length - 1;
	predicate = predicate || ((a,b) => a - b);
	while (start <= end)
	{
		const mid = Math.floor((start + end) / 2);
		const cmp = predicate(arr[mid], element);
		if (cmp === 0)
		{
			return mid;
		}
		else if (cmp < 0)
		{
			start = mid + 1;
		}
		else
		{
			end = mid - 1;
		}
	}
	return start;
}

export function insertInSortedArray(arr: any[], element: any, predicate?: (a,b) => number)
{
	const index = binarySearch(arr, element, predicate);
	arr.splice(index, 0, element);
	return arr;
}

export type MemoizeFunction<T extends Function> = T & {
	reset: () => void;
}
export function memoize<T extends Function>(fct: T, keyParams: number[], debug: boolean = false): MemoizeFunction<T>
{
	const mem = new Map<string, any>();
	const memoizeFct: any = (...params) =>
	{
		const memkey = JSON.stringify(keyParams.map(n => params[n]));
		if (mem.has(memkey))
		{
			const memRet = mem.get(memkey);
			if (debug)
			{
				console.log(`memoize hit: ${memRet.i}`);
			}
			return memRet.ret;
		}
		const ret = fct(...params);
		if (ret !== null)
		{
			mem.set(memkey, { i: mem.size, ret });
		}
		return ret;
	};
	memoizeFct.reset = () => mem.clear();
	return memoizeFct;
}

export function extend(dst: any, ...sources: any[]): any
{
	return extendEx(dst, ...sources.concat({}));
}

export function extendEx(dst: any, ...sourcesAndOptions: any[])
{
	if (dst)
	{
		const sources = sourcesAndOptions.slice(); // clone array
		const options = sources.pop();
		sources.forEach((obj) =>
		{
			if (!isObject(obj) && !isFunction(obj))
			{
				return;
			}
			for (const key in obj)
			{
				const src = obj[key];
				if (isObject(src))
				{
					if (isDate(src))
					{
						dst[key] = new Date(src.valueOf());
					}
					else if (src instanceof Set)
					{
						dst[key] = new Set(src);
					}
					else
					{
						if (isArray(src) && options.mergeArray === false)
						{
							dst[key] = [];
						}
						else if (!isObject(dst[key]))
						{
							dst[key] = isArray(src) ? [] : {};
						}
						extend(dst[key], src);
					}
				}
				else
				{
					dst[key] = src;
				}
			}
		});
	}
	return dst;
}

export type JsType = "String" | "Date" | "Number" | "Boolean" | "Json" | "File" | "Function" | "Array" |
	"RegExp" | "Object" | "FormData" | "Blob" | "Unknown";

const class2type: Record<string, JsType> = {
	"[object Boolean]": "Boolean",
	"[object Number]": "Number",
	"[object String]": "String",
	"[object Function]": "Function",
	"[object CallbackFunction]": "Function",
	"[object Array]": "Array",
	"[object Date]": "Date",
	"[object RegExp]": "RegExp",
	"[object File]": "File",
	"[object Object]": "Object",
	"[object FormData]": "FormData",
	"[object Blob]": "Blob"
};
const toString = Object.prototype.toString;

export function getJsType(v: any): JsType
{
	return v == null ? "Unknown" : class2type[toString.call(v)] || "Object";
}

export function isDefined(v: any): boolean
{
	return typeof v !== "undefined";
}

export function isUndefined(v: any): boolean
{
	return typeof v === "undefined";
}

export function isFunction(v: any): boolean
{
	return getJsType(v) === "Function";
}

export function isArray<T>(v: any): v is Array<T>
{
	return getJsType(v) === "Array";
}

export function isDate(v: any): v is Date
{
	return getJsType(v) === "Date";
}

export function isNumber(v: any): v is number
{
	return getJsType(v) === "Number";
}

export function isObject(v: any): v is Object
{
	return v !== null && typeof v === "object";
}

export const hasOwn = Object.prototype.hasOwnProperty;

export function isPlainObject(obj: any): obj is Record<string, any>
{
	if (!obj || typeof obj !== "object" || obj.nodeType)
	{
		return false;
	}
	try
	{
		if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
		{
			return false;
		}
	}
	catch (e)
	{
		return false;
	}
	let key;
	for (key in obj) {}
	return key === undefined || hasOwn.call(obj, key);
}
