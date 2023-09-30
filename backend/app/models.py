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


class PreviewReport(BaseModel):
    cryptocurrencies_amount: list[CryptocurrencyAmount]
    cryptocurrency_manual_rates: list[CryptocurrencyManualRates]


class CryptocurrencyAverageValue(BaseModel):
    name: str
    quantity: float


class SingleCryptocurrenciesData(BaseModel):
    name: str
    quantity: float
    data_sources: list[str]
    avg_value: float


class CantorCryptocurrencyData(BaseModel):
    code: str
    PLN_rate: float | None
    USD_rate: float | None
    quantity: float
    converted_from_USD: Optional[bool]
    NBP_USD_rate: float
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
