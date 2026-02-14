This is a project that will attempt to create a web app that will perform the Discounted Cash Flow Valuation for a company.

The layers for the application are as follows:

1. Data ingestion layer

- This is the layer in the backend which will accept a company name/ticker from the UI and fetch the annual report for that company from the Stock Exchange
- The annual report that is fetched will then be parsed by Gemini to fetch the following details:
  - Cash From Operating Activities
  - Capital Expenditures
  - Debt Ratio
  - Equity Ratio
  - Net Debt
  - Shares Outstanding

2. Validation layer

- Here, the data returned by Gemini will undergo some basic validation before it is sent to the storage layer for later use.
- This layer is currently very thin and will need further work.

3. Storage layer

- MongoDB is being used to store the validated financial data of the company that has been parsed by Gemini.
- Each entry in the Database will be keyed by the company ticker or cik value.
- Financial data of each company over multiple years will be stored as an array within the company entry.

4. Valuation engine

- If the complete company financial data is present, then this layer will perform the basic calculation of the DCF model.

5. Assumption modeling

- TBD

6. Sensitivity analysis

- TBD

7. Frontend presentation

- Currently showing basic tables for the project cashflows.
- Showing a basic form to input the variables for the Valuation Model.
- A simple table to show the final valuation band for the company stock
