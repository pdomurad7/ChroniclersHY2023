from app.models import PreviewReport
from app.cantors.CantorInterface import known_cantors
from models import PreviewReport, ResponseReport


def get_current_supported_currencies(db):
    return db["supported_cryptocurrencies"]


def get_preview_report_calculations(preview_report: PreviewReport):
    return preview_report
