import datetime
import uuid
import logging
import requests

from cantors.CantorInterface import known_cantors

logger = logging.getLogger(__name__)


class ReportGenerator:
    def __init__(self, previous_report_data: dict, db):
        logger.info(
            f"Generating report {previous_report_data['name']} with id {previous_report_data['id']} for user {previous_report_data['owner_data']}"
        )
        self.report_header = {
            "name": previous_report_data["name"],
            "id": uuid.uuid4().hex,
            "date": datetime.datetime.now().isoformat(),
            "case_number": previous_report_data["case_number"],
            "owner_data": previous_report_data["owner_data"],
            "value_currency": previous_report_data["value_currency"],
            "calculation_method": "Average of all available rates",
        }
        self.cryptocurrencies_amount = previous_report_data["cryptocurrencies_amount"]
        self.cryptocurrency_manual_rates = previous_report_data[
            "cryptocurrency_manual_rates"
        ]
        logger.info(
            f"User {previous_report_data['owner_data']} cryptocurrencies amount: {self.cryptocurrencies_amount}"
        )
        logger.info(
            f"User {previous_report_data['owner_data']} manual rates: {self.cryptocurrency_manual_rates}"
        )
        self.nbp_usd_rate = self._get_nbp_usd_rate()
        self.db = db
        self.cryptocurrencies_data = []
        self.exchange_data = []

    def get_report(self):
        self._update_exchange_data()
        self._update_cryptocurrencies_data()
        report = self.report_header
        report["cryptocurrencies_data"] = self.cryptocurrencies_data
        report["exchange_data"] = self.exchange_data
        logger.info(f"Generated report {report}")
        return report

    def _update_exchange_data(self):
        self._known_cantors_rates()
        self._manual_cantors_rates()

    def _update_cryptocurrencies_data(self):
        for cryptocurrency in self.cryptocurrencies_amount:
            cryptocurrency_dict = {
                "name": cryptocurrency["name"],
                "quantity": cryptocurrency["quantity"],
                "data_sources": [],
                "avg_value": 0,
            }
            for cantor in self.exchange_data:
                for rate in cantor["cryptocurrency_rates"]:
                    if rate["code"] == cryptocurrency["name"]:
                        if cantor["name"] not in cryptocurrency_dict["data_sources"]:
                            cryptocurrency_dict["data_sources"].append(cantor["name"])
                        cryptocurrency_dict["avg_value"] += rate["value"]
            cryptocurrency_dict["avg_value"] /= len(cryptocurrency_dict["data_sources"])
            self.cryptocurrencies_data.append(cryptocurrency_dict)

    def _known_cantors_rates(self):
        for cantor in known_cantors:
            cantor_obj = cantor()
            cantor_dict = {
                "url": cantor_obj.url,
                "name": cantor_obj.name,
                "cryptocurrency_rates": [],
            }
            for cryptocurrency in self.cryptocurrencies_amount:
                crypto_rate = {}
                result_rate = cantor_obj.get_rate(cryptocurrency["name"])
                if result_rate is not None:
                    if result_rate["currency"] == "USD":
                        crypto_rate["converted_from_USD"] = True
                        crypto_rate["USD_rate"] = float(result_rate["result"])
                        crypto_rate["PLN_rate"] = (
                            result_rate["result"] * self.nbp_usd_rate
                        )
                    else:
                        crypto_rate["converted_from_USD"] = False
                        crypto_rate["PLN_rate"] = result_rate["result"]
                    crypto_rate["NBP_USD_rate"] = self.nbp_usd_rate
                    crypto_rate["code"] = cryptocurrency["name"]
                    crypto_rate["quantity"] = cryptocurrency["quantity"]
                    crypto_rate["value"] = (
                        float(crypto_rate["PLN_rate"]) * cryptocurrency["quantity"]
                    )
                if crypto_rate:
                    cantor_dict["cryptocurrency_rates"].append(crypto_rate)
            self.exchange_data.append(cantor_dict)

    def _manual_cantors_rates(self):
        for cantor in self.cryptocurrency_manual_rates:
            cantor_dict = {
                "url": cantor["url"],
                "name": cantor["name"],
                "cryptocurrency_rates": [],
            }
            for cryptocurrency in self.cryptocurrencies_amount:
                crypto_rate = {}
                for rate in cantor["cryptocurrency_rates"]:
                    if rate["name"] == cryptocurrency["name"]:
                        crypto_rate["code"] = cryptocurrency["name"]
                        crypto_rate["quantity"] = cryptocurrency["quantity"]
                        if rate["currency"] == "USD":
                            crypto_rate["converted_from_USD"] = True
                            crypto_rate["USD_rate"] = rate["rate"]
                            crypto_rate["PLN_rate"] = rate["rate"] * self.nbp_usd_rate
                        else:
                            crypto_rate["converted_from_USD"] = False
                            crypto_rate["PLN_rate"] = rate["rate"]
                        crypto_rate["NBP_USD_rate"] = self.nbp_usd_rate
                        crypto_rate["value"] = (
                            float(crypto_rate["PLN_rate"]) * cryptocurrency["quantity"]
                        )

                if crypto_rate:
                    cantor_dict["cryptocurrency_rates"].append(crypto_rate)
            self.exchange_data.append(cantor_dict)

    @staticmethod
    def _get_nbp_usd_rate():
        url = "http://api.nbp.pl/api/exchangerates/tables/A/last/1/"
        response = requests.get(url).json()
        for rate in response[0]["rates"]:
            if rate["code"] == "USD":
                return rate["mid"]
