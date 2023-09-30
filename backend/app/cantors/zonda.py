import requests


def _get_zonda_url(cryptocurrency_name: str, currency: str):
    url = f"https://api.zondacrypto.exchange/rest/trading/ticker/{cryptocurrency_name}-{currency}"
    return url


def get_zonda_rate(cryptocurrency_name: str):
    url = _get_zonda_url(cryptocurrency_name, "PLN")
    response = requests.get(url).json()
    if response["status"] == "Ok":
        return {"result": response["ticker"]["highestBid"], "currency": "PLN"}
    url = _get_zonda_url(cryptocurrency_name, "USD")
    response = requests.get(url).json()
    if response["status"] == "Ok":
        return {"result": response["ticker"]["highestBid"], "currency": "USD"}
    else:
        return None
