import re

with open("input.txt") as file:
	data = file.read().strip()

words = data.split("\n")

def isNiceWordPart1(word: str):
	m = re.findall("([aeiou])", word)
	if len(m) < 3:
		return False
	m = re.findall("([a-z])\\1+", word)
	if len(m) == 0:
		return False
	m = re.findall("(ab|cd|pq|xy)", word)
	if len(m) > 0:
		return False
	return True

def isNiceWordPart2(word: str):
	pairs = {}
	gotPairTwice = False
	gotRepeat = False
	for i in range(len(word)-1):
		pair = word[i:i+2]
		if not gotPairTwice:
			if pair in pairs:
				gotPairTwice = pairs[pair]+1 != i
			else:
				pairs[pair] = i
		if not gotRepeat:
			gotRepeat = pair == word[i-1:i+1][::-1]
		if gotPairTwice and gotRepeat:
			break
	return gotPairTwice and gotRepeat

isNiceWords = [isNiceWordPart1, isNiceWordPart2]

for part in [1,2]:
	count = 0
	for word in words:
		count += 1 if isNiceWords[part-1](word) else 0
	print(f"part {part}, count: {count}")
