from models import PDF


class PdfGenerator:
    def __init__(self, data: dict):
        self.data = data
        self.pdf = PDF()
        self.pdf.add_page()

    def generate_pdf(self) -> bytes:
        self._add_general_information()
        self._add_cryptocurrency_data()
        self._add_exchange_data()
        return bytes(self.pdf.output())

    def _add_general_information(self):
        self.pdf.chapter_title("General Information", align="C")
        self.pdf.add_line()
        self.pdf.chapter_body(f"Report Name: {self.data['name']}")
        self.pdf.chapter_body(f"Report ID: {self.data['id']}")
        self.pdf.chapter_body(f"Date: {self.data['date']}")
        self.pdf.chapter_body(f"Case Number: {self.data['case_number']}")
        self.pdf.chapter_body(f"Owner Data: {self.data['owner_data']}")
        self.pdf.add_line()

    def _add_cryptocurrency_data(self):
        self.pdf.chapter_title("Cryptocurrency Data", align="C")
        self.pdf.add_line()
        for cryptocurrency in self.data["cryptocurrencies_data"]:
            self.pdf.chapter_title(f"Cryptocurrency Name: {cryptocurrency['name']}")
            self.pdf.chapter_body(f"Quantity: {cryptocurrency['quantity']}")
            self.pdf.chapter_body(
                f"NBP USD Avg. Rate: {cryptocurrency['NBP_USD_rate']}"
            )
            self.pdf.chapter_body(
                f"Data Sources: {', '.join(cryptocurrency['data_sources'])}"
            )
            self.pdf.chapter_body(f"Average Value: {cryptocurrency['avg_value']}")
        self.pdf.add_line()

    def _add_exchange_data(self):
        self.pdf.chapter_title("Exchange Data", align="C")
        self.pdf.add_line()
        for exchange in self.data["exchange_data"]:
            self.pdf.chapter_title(f"Exchange Name: {exchange['name']}")
            self.pdf.add_line()
            if not exchange["cryptocurrency_rates"]:
                self.pdf.chapter_body("No data available")
                return
            for cryptocurrency in exchange["cryptocurrency_rates"]:
                self.pdf.chapter_body(f"Cryptocurrency Code: {cryptocurrency['code']}")
                if cryptocurrency["USD_rate"]:
                    self.pdf.chapter_body(f"USD Rate: {cryptocurrency['USD_rate']}")
                self.pdf.chapter_body(
                    f"PLN Rate: {cryptocurrency['PLN_rate']} {'(converted)' if cryptocurrency['converted_from_USD'] else ''}"
                )
                self.pdf.chapter_body(f"Value: {cryptocurrency['value']}")
            self.pdf.add_line()
