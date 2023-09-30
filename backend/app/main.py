from app.services import get_report_calculations

import json

from fastapi import FastAPI, HTTPException, Depends
from fastapi import Response

from PdfGenerator import PdfGenerator
from config import settings
from dependecies import get_db
from services import get_current_supported_currencies
from app.models import Report, ResponseReport

app = FastAPI()


@app.get("/cryptocurrencies")
def get_supported_currencies(db=Depends(get_db)):
    return get_current_supported_currencies(db)


@app.get("/report", response_model=ResponseReport)
def get_preview_report(report: Report, db=Depends(get_db)):
    return get_report_calculations(report, db)


@app.get("/chief-names")
def list_chief_names():
    with open(settings.CHIEF_NAMES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@app.post("/report/pdf")
def get_report_pdf(report: Report):
    report = get_preview_report(report).model_dump()

    try:
        pdf_report = PdfGenerator(report).generate_pdf()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Prepare the filename and headers
    filename = f"{report['name']}_{report['id']}.pdf"
    headers = {"Content-Disposition": f"attachment; filename={filename}"}

    # Return the file as a response
    return Response(content=pdf_report, media_type="application/pdf", headers=headers)
