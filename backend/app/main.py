import json
from fastapi import FastAPI
from .config import settings

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/chief-names")
def list_chief_names():
    with open(settings.CHIEF_NAMES_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)
