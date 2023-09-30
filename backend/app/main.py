from fastapi import Depends
from dependecies import get_db
from services import get_current_supported_currencies, get_preview_report_calculations

import json

from fastapi import FastAPI


from fastapi import FastAPI, HTTPException, Depends

from config import settings
from dependecies import get_db
from pydantic import PreviewReport, ResponseReport
from services import get_current_supported_currencies, get_preview_report_calculations
from fpdf import FPDF

app = FastAPI()


class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Crypto Asset Valuation Report", align="C", ln=True)
        self.ln(10)

    def chapter_title(self, title):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, title, ln=True, align="L")
        self.ln(4)

    def chapter_body(self, body):
        self.set_font("Arial", "", 12)
        self.multi_cell(0, 10, body)
        self.ln(2)

    def add_line(self):
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)


@app.get("/cryptocurrencies")
def get_supported_currencies(db=Depends(get_db)):
    return get_current_supported_currencies(db)


@app.get("/preview-report", response_model=ResponseReport)
def get_preview_report(preview_report: PreviewReport):
    return get_preview_report_calculations(preview_report)


@app.get("/chief-names")
def list_chief_names():
    with open(settings.CHIEF_NAMES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/report/pdf")
def get_report_pdf(data: dict):
    pdf = PDF()
    pdf.add_page()

    try:
        # Title
        pdf.chapter_title("General Information")
        pdf.add_line()
        pdf.chapter_body(f"Report Name: {data['name']}")
        pdf.chapter_body(f"Report ID: {data['id']}")
        pdf.chapter_body(f"Date: {data['date']}")
        pdf.chapter_body(f"Case Number: {data['case_number']}")
        pdf.chapter_body(f"Owner Data: {data['owner_data']}")
        pdf.add_line()

        # Cryptocurrency Data
        pdf.chapter_title("Cryptocurrency Data")
        pdf.add_line()
        for cryptocurrency in data["cryptocurrencies_data"]:
            pdf.chapter_title(f"Cryptocurrency Name: {cryptocurrency['name']}")
            pdf.chapter_body(f"Quantity: {cryptocurrency['quantity']}")
            pdf.chapter_body(f"NBP USD Avg. Rate: {cryptocurrency['NBP_USD_rate']}")
            pdf.chapter_body(f"Data Sources: {', '.join(cryptocurrency['data_sources'])}")
            pdf.chapter_body(f"Average Value: {cryptocurrency['avg_value']}")
        pdf.add_line()

        # Exchange Data
        pdf.chapter_title("Exchange Data")
        pdf.add_line()
        for exchange in data["exchange_data"]:
            pdf.chapter_title(f"Exchange Name: {exchange['name']}")
            pdf.add_line()
            for cryptocurrency in exchange["cryptocurrency_rates"]:
                if not cryptocurrency["USD_rate"] and not cryptocurrency["PLN_rate"]:
                    pdf.chapter_body(f"Cryptocurrency Code: {cryptocurrency['code']}")
                    pdf.chapter_body("Brak danych")
                    continue
                pdf.chapter_body(f"Cryptocurrency Code: {cryptocurrency['code']}")
                pdf.chapter_body(f"USD Rate: {cryptocurrency['USD_rate']}")
                pdf.chapter_body(f"PLN Rate: {cryptocurrency['PLN_rate']}")
                pdf.chapter_body(f"Converted from USD: {cryptocurrency['converted_from_USD']}")
                pdf.chapter_body(f"Value: {cryptocurrency['value']}")
            pdf.add_line()

        pdf_file = "crypto_report_pretty.pdf"
        pdf.output(pdf_file)

        return pdf_file

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
