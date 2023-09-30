import json

from fastapi import FastAPI, HTTPException, Depends
from fastapi import Response

from config import settings
from dependecies import get_db
from models import PreviewReport, ResponseReport, PDF
from services import get_current_supported_currencies, get_preview_report_calculations

app = FastAPI()


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
def get_report_pdf(report: PreviewReport):
    data = get_preview_report_calculations(report)

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
            pdf.chapter_body(
                f"Data Sources: {', '.join(cryptocurrency['data_sources'])}"
            )
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
                pdf.chapter_body(
                    f"Converted from USD: {cryptocurrency['converted_from_USD']}"
                )
                pdf.chapter_body(f"Value: {cryptocurrency['value']}")
            pdf.add_line()

        # Prepare the filename and headers
        filename = f"{data['name']}_{data['id']}.pdf"
        headers = {"Content-Disposition": f"attachment; filename={filename}"}

        # Return the file as a response
        return Response(
            content=bytes(pdf.output()), media_type="application/pdf", headers=headers
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
