import random
from string import ascii_lowercase
import json
import pandas
from faker import Faker

""" This script generates test emails for data mockup purposes """

fake = Faker()

LIMIT = 1000

emails = []
for i in range(LIMIT):
    emails.append({"email": fake.email(), "password": None})

df = pandas.DataFrame(emails, index=None)
df.to_csv("client_emails.csv", index=None)
