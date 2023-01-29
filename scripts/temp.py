
author_ids = [1,2,3,4,5]

for i in range(len(author_ids) - 1):
    for j in range(i + 1, len(author_ids)):
        print(f'i: {i}, j:{j}')

