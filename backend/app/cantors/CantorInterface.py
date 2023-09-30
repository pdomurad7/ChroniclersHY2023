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
        super().__init__(url="https://api.zondacrypto.exchange/rest/trading/ticker/", name="ZondaCrypto")

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
        else:
            return None


known_cantors = ICantor.__subclasses__()
