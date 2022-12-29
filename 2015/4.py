import hashlib
for part in [1,2]:
	starting0 = "00000" if part == 1 else "000000"
	num = 0
	hash = ""
	while not hash.startswith(starting0):
		num += 1
		key = f"yzbqklnj{num}"
		hash = hashlib.md5(key.encode("utf-8")).hexdigest()
	print(f"part {part}, num: {num}")
