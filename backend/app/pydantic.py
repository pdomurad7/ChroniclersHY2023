from pydantic import BaseModel
from typing import Optional


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
