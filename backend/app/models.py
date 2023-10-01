from typing import Optional

from fpdf import FPDF
from pydantic import BaseModel


class CryptocurrencyRate(BaseModel):
    name: str
    rate: float
    currency: str


class CryptocurrencyAmount(BaseModel):
    name: str
    quantity: float


class CryptocurrencyManualRates(BaseModel):
    url: str
    name: str
    cryptocurrency_rates: list[CryptocurrencyRate]


class Report(BaseModel):
    name: str | None = None
    case_number: str | None = None
    owner_data: str | None = None
    value_currency: str | None = None
    cryptocurrencies_amount: list[CryptocurrencyAmount] | None = None
    cryptocurrency_manual_rates: list[CryptocurrencyManualRates] | None = None


class CryptocurrencyAverageValue(BaseModel):
    name: str
    quantity: float


class SingleCryptocurrenciesData(BaseModel):
    name: str
    quantity: float
    data_sources: list[str]
    avg_value: float
    NBP_USD_rate: Optional[float]


class CantorCryptocurrencyData(BaseModel):
    code: str
    PLN_rate: float | None
    USD_rate: float | None = None
    quantity: float
    converted_from_USD: bool = False
    value: Optional[float]


class CantorData(BaseModel):
    url: str
    name: str
    cryptocurrency_rates: list[CantorCryptocurrencyData]


class ResponseReport(BaseModel):
    name: str
    id: str
    date: str
    case_number: str
    owner_data: str
    value_currency: str
    calculation_method: str
    cryptocurrencies_data: list[SingleCryptocurrenciesData]
    exchange_data: list[CantorData]


class PDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, "Crypto Asset Valuation Report", align="C", ln=True)
        self.ln(10)

    def chapter_title(self, title, style="B", align="L"):
        self.set_font("Helvetica", style, 12)
        self.cell(0, 10, title, ln=True, align=align)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font("Helvetica", "", 12)
        self.multi_cell(0, 10, body)
        self.ln(2)

    def add_line(self):
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)
