import json


def get_db():
    with open("db.json", "r") as f:
        return json.load(f)
