from models import PreviewReport, ResponseReport


def get_current_supported_currencies(db):
    return db["supported_cryptocurrencies"]


def get_preview_report_calculations(preview_report: PreviewReport):
    return ResponseReport(
        **preview_report.model_dump(),
        date="09/30/2023",
        calculation_method="Average of Three Rates",
        cryptocurrencies_data=[
            {
                "name": "Bitcoin",
                "quantity": 0.5,
                "data_sources": ["Cantor", "Manual"],
                "avg_value": 10000.0,
            },
            {
                "name": "Ethereum",
                "quantity": 0.5,
                "data_sources": ["Cantor", "Manual"],
                "avg_value": 10000.0,
            },
        ],
        exchange_data=[
            {
                "url": "https://api.nbp.pl/api/exchangerates/rates/a/usd/",
                "name": "USD",
                "cryptocurrency_rates": [
                    {
                        "code": "ETH",
                        "quantity": 12,
                        "USD_rate": 3000,
                        "PLN_rate": 14000,
                        "converted_from_USD": "true",
                        "value": 15000,
                        "NBP_USD_rate": 3.8,
                    },
                    {
                        "code": "CITY",
                        "quantity": 1000,
                        "USD_rate": 1000,
                        "PLN_rate": 4300,
                        "converted_from_USD": "true",
                        "value": 6000,
                        "NBP_USD_rate": 3.8,
                    },
                ],
            },
            {
                "url": "https://api.nbp.pl/api/exchangerates/rates/a/eur/",
                "name": "EUR",
                "cryptocurrency_rates": [
                    {
                        "code": "ETH",
                        "quantity": 12,
                        "USD_rate": 3000,
                        "PLN_rate": 14000,
                        "converted_from_USD": "true",
                        "value": 15000,
                        "NBP_USD_rate": 3.8,
                    },
                    {
                        "code": "CITY",
                        "quantity": 1000,
                        "USD_rate": 1000,
                        "PLN_rate": 4300,
                        "converted_from_USD": "true",
                        "value": 6000,
                        "NBP_USD_rate": 3.8,
                    },
                ],
            },
        ],
    )
