import psycopg2;

from config import config;

def test_query():
    params = config()

    print(params)

    connection = psycopg2.connect(**params)

    cursor = connection.cursor()
    cursor.execute('SELECT * FROM publication_data LIMIT 1;')
    results = cursor.fetchall()

    print(results)

test_query()


# fetch first n rows from publications_data
def fetch_publication_data(num_rows):
    pass


# for each row
    # for each author_id pair (a, b)
        # if either not seen before, add to known authors
        # add a -> b connection, where a is always smaller than b
        # if seen before, add connection to this id
        # else, create a new author and add to list (fetching data from researcher_data)
        # 

# a - b
# a: [... b: 3]

# graph storage
# adjacency list



# what if only store a -> b

# double for loop
# for i in range(0, end)
    # for j in range(i + 1, end)
        # will only produce unique ones
