from fastapi import FastAPI, Depends
from app.dependecies import get_db
from app.services import get_current_supported_currencies, get_preview_report_calculations

from app.pydantic import PreviewReport, ResponseReport
import json

from fastapi import FastAPI

from config import settings

app = FastAPI()


@app.get("/cryptocurrencies")
def get_supported_currencies(db=Depends(get_db)):
    return get_current_supported_currencies(db)


@app.get("/preview-report", response_model=ResponseReport)
def get_preview_report(preview_report: PreviewReport):
    return get_preview_report_calculations(preview_report)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/chief-names")
def list_chief_names():
    with open(settings.CHIEF_NAMES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
