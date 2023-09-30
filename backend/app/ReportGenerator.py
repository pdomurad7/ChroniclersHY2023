class ReportGenerator:
    def __init__(self, previous_report_data: dict):
        self.cryptocurrencies_amount = previous_report_data["cryptocurrencies_amount"]
        self.cryptocurrency_manual_rates = previous_report_data[
            "cryptocurrency_manual_rates"
        ]


data = {
    "name": "Crypto Asset Valuation",
    "id": "12345",
    "date": "09/30/2023",
    "case_number": "ABC123",
    "owner_data": "Jan Kowalski",
    "value_currency": "PLN",
    "calculation_method": "Average of Three Rates",
    "cryptocurrencies_data": [
        {
            "name": "Bitcoin (BTC)",
            "quantity": 0.001,
            "data_sources": [
                "cantor1",
                "cantor2",
            ],
            "avg_value": 100,
        },
        {
            "name": "Bitcoin (BTC)",
            "quantity": 0.002,
            "data_sources": [
                "cantor1",
                "cantor2",
            ],
            "avg_value": 110,
        },
        {
            "name": "Ethereum (ETH)",
            "quantity": 12,
            "data_sources": [
                "cantor1",
                "cantor2",
            ],
            "avg_value": 11222,
        },
        {
            "name": "Manchester City Fan Token (CITY)",
            "quantity": 1000,
            "data_sources": [
                "cantor1",
                "cantor2",
            ],
            "avg_value": 200330,
        },
    ],
    "exchange_data": [
        {
            "url": "https://cantor-1.com",
            "name": "cantor1",
            "cryptocurrency_rates": [
                {
                    "code": "BTC",
                    "quantity": 0.001,
                    "USD_rate": 45000,
                    "PLN_rate": 250000,
                    "converted_from_USD": "true",
                    "NBP_USD_rate": 4.33,
                    "value": 36000,
                },
                {
                    "code": "BTC",
                    "quantity": 0.002,
                    "USD_rate": 45000,
                    "PLN_rate": 250000,
                    "converted_from_USD": "true",
                    "NBP_USD_rate": 4.33,
                    "value": 36000,
                },
                {
                    "code": "ETH",
                    "quantity": 12,
                    "USD_rate": 3000,
                    "PLN_rate": 14000,
                    "converted_from_USD": "true",
                    "NBP_USD_rate": 4.33,
                    "value": 15000,
                },
                {
                    "code": "CITY",
                    "quantity": 1000,
                    "USD_rate": 1000,
                    "PLN_rate": 4300,
                    "converted_from_USD": "true",
                    "NBP_USD_rate": 4.33,
                    "value": 6000,
                },
            ],
        },
        {
            "url": "https://cantor-2.com",
            "name": "cantor2",
            "cryptocurrency_rates": [
                {
                    "code": "BTC",
                    "quantity": 0.001,
                    "USD_rate": 45000,
                    "PLN_rate": 250000,
                    "converted_from_USD": "true",
                    "value": 36000,
                },
                {
                    "code": "BTC",
                    "quantity": 0.002,
                    "USD_rate": 45000,
                    "PLN_rate": 250000,
                    "converted_from_USD": "true",
                    "value": 36000,
                },
                {
                    "code": "ETH",
                    "quantity": 12,
                    "USD_rate": 3000,
                    "PLN_rate": 14000,
                    "converted_from_USD": "true",
                    "value": 15000,
                },
                {
                    "code": "CITY",
                    "quantity": 1000,
                    "USD_rate": 1000,
                    "PLN_rate": 4300,
                    "converted_from_USD": "true",
                    "value": 6000,
                },
            ],
        },
        {
            "url": "https://cantor-3.com",
            "name": "cantor3",
            "cryptocurrency_rates": [
                {
                    "code": "BTC",
                    "quantity": 0.001,
                    "USD_rate": None,
                    "PLN_rate": None,
                },
                {
                    "code": "BTC",
                    "quantity": 0.002,
                    "USD_rate": None,
                    "PLN_rate": None,
                },
                {
                    "code": "ETH",
                    "quantity": 12,
                    "USD_rate": None,
                    "PLN_rate": None,
                },
                {
                    "code": "CITY",
                    "quantity": 1000,
                    "USD_rate": None,
                    "PLN_rate": None,
                },
            ],
        },
    ],
}
