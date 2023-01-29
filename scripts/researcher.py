
# obsolete
class Researcher:
    def __init__(self, init_data):
        self.first_name = init_data[0]
        self.last_name = init_data[1]
        self.email = init_data[2]
        self.rank = init_data[3]
        self.prime_department = init_data[4]
        self.prime_faculty = init_data[5]
        self.scopus_id = init_data[6]

    def __str__(self):
        return f'{self.first_name} {self.last_name}, ID: {self.scopus_id}'