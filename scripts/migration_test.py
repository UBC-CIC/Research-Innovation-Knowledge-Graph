import psycopg2;

from config import config;

def main():
    params = config()
    connection = psycopg2.connect(**params)

    publications = fetch_publication_data(connection, 5)

    for pub in publications:
        print(pub)


def fetch_publication_data(db_connection, num_rows):
    cursor = db_connection.cursor()
    cursor.execute(f'SELECT author_ids FROM publication_data LIMIT {num_rows};')
    results = cursor.fetchall()

    return results


main()


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
