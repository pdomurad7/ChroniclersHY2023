from abc import ABC, abstractmethod

import requests


class ICantor(ABC):
    def __init__(self, url: str, name: str):
        self.url = url
        self.name = name

    @abstractmethod
    def get_rate(self, cryptocurrency_name: str):
        raise NotImplementedError


class Zonda(ICantor):
    def __init__(self):
        super().__init__(
            url="https://api.zondacrypto.exchange/rest/trading/ticker/",
            name="ZondaCrypto",
        )

    def _get_url(self, cryptocurrency_name: str, currency: str):
        url = f"{self.url}{cryptocurrency_name}-{currency}"
        return url

    def get_rate(self, cryptocurrency_name: str):
        url = self._get_url(cryptocurrency_name, "PLN")
        response = requests.get(url).json()
        if response["status"] == "Ok":
            return {"result": response["ticker"]["highestBid"], "currency": "PLN"}
        url = self._get_url(cryptocurrency_name, "USD")
        response = requests.get(url).json()
        if response["status"] == "Ok":
            return {"result": response["ticker"]["highestBid"], "currency": "USD"}
        return None


class Binance(ICantor):
    def __init__(self):
        super().__init__(
            url="https://api.binance.com/api/v3/ticker/price?symbol=",
            name="Binance",
        )

    def _get_url(self, cryptocurrency_name: str, currency: str):
        url = f"{self.url}{cryptocurrency_name}{currency}"
        return url

    def get_rate(self, cryptocurrency_name: str):
        url = self._get_url(cryptocurrency_name, "PLN")
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {"result": data["price"], "currency": "PLN"}

        url = self._get_url(cryptocurrency_name, "USDT")
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {"result": data["price"], "currency": "USD"}
        return None


class Kraken(ICantor):
    def __init__(self):
        super().__init__(
            url="https://api.kraken.com/0/public/Ticker?pair=",
            name="Kraken",
        )
        self.mapping = {
            "BTC": "XBT",
            "ETH": "ETH",
            "CITY": "CITY",
        }

    def _get_url(self, cryptocurrency_name: str, currency: str):
        url = f"{self.url}{cryptocurrency_name}{currency}"
        return url

    def get_rate(self, cryptocurrency_name: str):
        url = self._get_url(cryptocurrency_name, "PLN")
        response = requests.get(url)
        data = response.json()
        if not data["error"]:
            return {
                "result": float(
                    data["result"][f"X{self.mapping[cryptocurrency_name]}ZPLN"]["c"][0]
                ),
                "currency": "PLN",
            }

        url = self._get_url(cryptocurrency_name, "USD")
        response = requests.get(url)
        data = response.json()
        if not data["error"]:
            return {
                "result": float(
                    data["result"][f"X{self.mapping[cryptocurrency_name]}ZUSD"]["c"][0]
                ),
                "currency": "USD",
            }
        return None


known_cantors = ICantor.__subclasses__()
