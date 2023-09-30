import json


def get_db():
    with open("app/db.json", "r") as f:
        return json.load(f)
