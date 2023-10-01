# CryptoEval

The provided FastAPI application is designed to generate cryptocurrency valuation reports in PDF format based on
user-provided data and cryptocurrency exchange rates. Below is a technical description of the solution:

1. **FastAPI Framework**: The application is built using the FastAPI framework, which is a modern and efficient web
   framework for building APIs with Python. FastAPI is chosen for its asynchronous support, automatic validation, and
   interactive documentation generation.

2. **API Endpoints**:
    - `/cryptocurrencies`: This GET endpoint returns a list of currently supported cryptocurrencies. It relies on
      the `get_current_supported_currencies` function to fetch data from a database.

    - `/report`: This POST endpoint receives user input in the form of a `Report` Pydantic model, which includes
      information about the report, owner data, supported cryptocurrencies, and manual cryptocurrency rates.
      The `get_report_calculations` function generates a report based on this input.

    - `/chief-names`: This GET endpoint reads chief names from a JSON file and returns them.

    - `/report/pdf`: This POST endpoint generates a PDF report based on the input data provided in the `Report` model.
      It uses the `PdfGenerator` class to create the PDF report.

3. **PDF Report Generation**:
    - The `PdfGenerator` class is responsible for generating the PDF report. It uses the `FPDF` library to create the
      PDF document.
    - The generated PDF report contains sections for general information, cryptocurrency data, and exchange data. Each
      section is formatted and populated with data from the input report.

4. **Cryptocurrency Exchange Rates**:
    - The application supports multiple cantors (external sources) to fetch cryptocurrency exchange rates. These cantors
      are defined as classes implementing the `ICantor` abstract base class.
    - Known cantors like "Zonda," "Binance," and "Kraken" are provided as subclasses of `ICantor`. They fetch exchange
      rates from their respective APIs.
    - The `ReportGenerator` class fetches exchange rates from known cantors for supported cryptocurrencies.

5. **Manual Cryptocurrency Rates**:
    - Users can provide manual cryptocurrency rates in the `Report` input. This information is also used to calculate
      the report.
    - Manual rates are processed and included in the exchange data section of the PDF report.

6. **Database (JSON)**:
    - The application uses a simple JSON database stored in a file named "db.json" to store supported cryptocurrencies
      and other data.

7. **Middleware**:
    - CORS middleware is added to allow cross-origin requests, making it possible to access the API from different
      domains.

8. **Settings**:
    - Application settings, such as file paths and directories, are managed through the `Settings` class.

9. **Error Handling**:
    - The application handles errors and exceptions, returning appropriate HTTP responses and error details when
      necessary.

10. **Extensibility and Maintainability**:
    - The application is designed with extensibility in mind. New cantors or data sources can be added by creating new
      subclasses of `ICantor`.
    - Data retrieval, processing, and reporting are separated into distinct classes and functions, making the codebase
      modular and maintainable.

11. **Testing**:
    - While the code includes error handling and validation, extensive unit testing would be beneficial to ensure the
      application works as expected in various scenarios.

12. **Documentation**:
    - The code includes some inline comments, but additional documentation and docstrings could be added to enhance code
      readability and maintainability.

Overall, this FastAPI application provides a flexible and extensible solution for generating cryptocurrency valuation
reports, incorporating data from multiple sources, and allowing users to customize report inputs.

# How to run the application

1. Set up env variables.

To use environment variables in your Docker Compose configuration, you can create an `.env` file in the same directory
as your `docker-compose.yml` file. This `.env` file should contain key-value pairs of environment variables that you
want to use in your services.

Here's an example of what your `.env` file might look like:

```dotenv
# Environment variables for the web service
PROJECT_NAME=mycryptoapp
API_PORT=8000

# Environment variables for the frontend service
FRONTEND_PORT=3000
```

In this example, we've defined environment variables for the web service (`PROJECT_NAME` and `API_PORT`) and the
frontend service (`FRONTEND_PORT`). You can add more variables as needed for your specific application.

Make sure to adjust the values of these environment variables according to your requirements and the ports you want to
use for your services.

When you run `docker compose`, it will automatically read these environment variables from the `.env` file and use them
in your services as specified in your `compose.yml` file.

2. Build and Run the Containers:

Navigate to the directory where your `compose.yml` file is located and run the following command to build and run
the containers:

```shell
docker-compose up --build
```

This command will build the Docker images defined in your Dockerfiles, create and start the containers, and make your
FastAPI application available on the specified API and frontend ports.

3. Access the Application:

Once the containers are up and running, you can access the FastAPI application at http://localhost:${API_PORT} and the
frontend at http://localhost:${FRONTEND_PORT} in your web browser.

That's it! You've successfully set up and run the FastAPI application using Docker Compose.

# How to use the application

1. **Currency Selection and Quantity**: The user begins by entering and adding their preferred cryptocurrencies and the
   respective quantities into their basket. As these selections are made, a real-time preview is automatically
   generated, displaying the estimated values of the chosen cryptocurrencies in the user's preferred currency. This
   preview also includes up-to-date exchange rates from various exchange offices.

2. **Custom Exchange Rates**: In addition to the automatic exchange rates, the user has the option to manually input
   specific exchange rates for the selected cryptocurrencies on each exchange market. These custom rates allow for more
   precise valuation and customization of the report. The preview is dynamically updated to reflect these manual
   entries, providing the user with an accurate snapshot of their cryptocurrency portfolio.

3. **Generate PDF Report**: Once the user has completed their currency and exchange rate selections, they can proceed to
   generate a comprehensive PDF report. This report consolidates all the chosen cryptocurrencies, their quantities,
   automatic and custom exchange rates, and other relevant information. The generated report serves as a detailed
   summary of the user's cryptocurrency holdings and valuations, which can be saved or printed for reference.

In summary, the platform empowers users to effortlessly manage their cryptocurrency portfolio, offering real-time
valuations, customizable exchange rates, and the convenience of generating informative PDF reports at their discretion.