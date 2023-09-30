import requests
import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Function to fetch crypto-asset exchange rate from an exchange
def get_crypto_exchange_rate(asset_symbol):
    api_url = f"https://api.zondacrypto.exchange/rest/trading/ticker/{asset_symbol}-PLN"
    response = requests.get(api_url)
    
    if response.status_code == 200:
        data = response.json()
        return data.get("last_price", 0)
    else:
        return None

# Function to convert USD to PLN using NBP exchange rate
def usd_to_pln_conversion(usd_amount):
    nbp_url = "http://api.nbp.pl/api/exchangerates/rates/A/USD/"
    response = requests.get(nbp_url)
    
    if response.status_code == 200:
        data = response.json()
        exchange_rate = data.get("rates")[0].get("mid")
        return usd_amount * exchange_rate
    else:
        return None

# Function to generate a PDF report
def generate_pdf_report(data):
    c = canvas.Canvas("crypto_asset_report.pdf", pagesize=letter)
    c.drawString(100, 750, "Crypto Asset Assessment Report")
    c.drawString(100, 730, "Case Number: " + data["case_number"])
    c.drawString(100, 710, "Owner: " + data["owner"])
    
    y = 680
    for asset in data["crypto_assets"]:
        c.drawString(100, y, "Crypto Asset: " + asset["name"])
        c.drawString(100, y - 20, "Quantity: " + str(asset["quantity"]))
        c.drawString(100, y - 40, "Exchange Rate Source: " + asset["exchange_rate_source"])
        c.drawString(100, y - 60, "USD Exchange Rate: " + str(asset["usd_exchange_rate"]))
        c.drawString(100, y - 80, "PLN Exchange Rate: " + str(asset["pln_exchange_rate"]))
        c.drawString(100, y - 100, "Value in PLN: " + str(asset["value_in_pln"]))
        y -= 120
    
    c.save()

if __name__ == "__main__":
    # User-entered data
    enforcement_authority = "Head of the Tax Office in Pruszków"
    case_number = "123456"
    owner = "John Doe"
    
    # Crypto-assets data
    crypto_assets = [
        {"name": "Bitcoin (BTC)", "quantity": 0.0050},
        {"name": "Ethereum (ETH)", "quantity": 12},
        {"name": "Manchester City Fan Token (CITY)", "quantity": 2000}
    ]
    
    # Fetch exchange rates and calculate values
    for asset in crypto_assets:
        asset_symbol = asset["name"].split(" ")[-1][1:-1]  # Extract symbol from name
        usd_exchange_rate = get_crypto_exchange_rate(asset_symbol)
        
        if usd_exchange_rate is not None:
            pln_exchange_rate = usd_to_pln_conversion(usd_exchange_rate)
            asset["exchange_rate_source"] = "Automatic"
            asset["usd_exchange_rate"] = usd_exchange_rate
            asset["pln_exchange_rate"] = pln_exchange_rate
            asset["value_in_pln"] = pln_exchange_rate * asset["quantity"]
        else:
            asset["exchange_rate_source"] = "Manual"
            asset["usd_exchange_rate"] = float(input(f"Enter the USD exchange rate for {asset['name']}: "))
            asset["pln_exchange_rate"] = usd_to_pln_conversion(asset["usd_exchange_rate"])
            asset["value_in_pln"] = asset["pln_exchange_rate"] * asset["quantity"]
    
    # Prepare data for the PDF report
    report_data = {
        "case_number": case_number,
        "owner": owner,
        "crypto_assets": crypto_assets
    }
    
    # Generate the PDF report
    generate_pdf_report(report_data)
    
    print("Crypto Asset Assessment Report generated successfully.")