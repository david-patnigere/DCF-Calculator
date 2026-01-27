This is a project that will attempt to create a web app that will perform the Discounted Cash Flow Valuation for a company.
The main input will be a copy of the Annual Report of the company that needs to be valued

The development steps are as follows:

A. Basic Flow:

1. Create a form on the UI to allow the user to input a company to search
2. Check the online databases for the company info (currently US companies only)
3. Allow the user to select the latest year for the DCF Calculation. The past 5 years from the selected year will be taken
4. Send the Company info and selected year to the backend.
5. Verify in the backend that the company is present in the database.
6. If no data is present for that company, go to the flow for Fetching Data.
7. Verify if the cash flow data is present for the selected year and preceding 4 years.
8. If data for any year is missing go to the flow for Fetching Data.
9. Fetch the free cash flow data for the required 5 year period.
10. Use the 5 year free cash flows to calculate the DCF for the company.
11. Send the results back to the front end.

B. Fetching Data:

1. Identify which data is missing (Company or Year).
2. Fetch the Annual Report for the missing year from the specified site.
3. Upload the Annual Report to Gemini for the Free Cash Flow calculations.
4. Write the Free Cash Flow data to the database. Ensure no duplication is done.
5. Return to the Basic Flow steps.
