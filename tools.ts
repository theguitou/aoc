
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
