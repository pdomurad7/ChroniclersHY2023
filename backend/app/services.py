from app.models import Report
from app.utils.ReportGenerator import ReportGenerator


def get_current_supported_currencies(db):
    return db["supported_cryptocurrencies"]


def get_report_calculations(preview_report: Report, db):
    return ReportGenerator(preview_report.model_dump(), db).get_report()
