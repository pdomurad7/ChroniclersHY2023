from fastapi import FastAPI, Query, Path, HTTPException

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
