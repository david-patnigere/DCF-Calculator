import express from "express";
import { isCompanyDataComplete } from "../../services/dataChecks.js";
import parseAnnualReport from "../../services/parseAnnualReport.js";
import {
  saveFinancialData,
  fetchCashFlows,
} from "../../services/cashFlowFunctions.js";
import { calculateDCF } from "../../services/dcfCalculator.js";
import { fetchLatest10K } from "../../services/secService.js";

const router = express.Router();

router.post("/fetch-cash-flows", async (req, res) => {
  // dummy code for spinner testing
  // setTimeout(() => {
  //   res.status(200).json({ message: "Historical Financial Data Ready" });
  // }, 5000);

  try {
    const { companyName, cik, latestYear } = req.body;
    console.log("Received Fetch Cash Flows Request: ", req.body);

    // Check if we have Cash Flow data for the company for the past 5 years
    const dataCheck = await isCompanyDataComplete(companyName, cik, latestYear);
    console.log("Data Check Result: ", dataCheck);

    // If data is missing, fetch from SEC and parse the annual report and save to database
    if (!dataCheck.companyPresent || !dataCheck.dataComplete) {
      for (const year of dataCheck.missingYears) {
        console.log(`Fetching missing data for year: ${year}`);
        const report = await fetchLatest10K(cik, year);
        if (report) {
          console.log(`Fetched Report for Year ${year}: `, report.reportURL);
          const financialDataResult = await parseAnnualReport(report.reportURL);
          console.log(
            "Calculated Financial Data Result: ",
            financialDataResult
          );
          await saveFinancialData({
            companyName: companyName,
            cik: cik,
            reportYear: year,
            cashFromOperatingActivities:
              financialDataResult.cashFromOperatingActivities,
            capitalExpenditures: financialDataResult.capitalExpenditures,
            unit: financialDataResult.unit,
            currency: financialDataResult.currency,
            debtRatio: financialDataResult.debtRatio,
            equityRatio: financialDataResult.equityRatio,
            netDebt: financialDataResult.netDebt,
            sharesOutstanding: financialDataResult.sharesOutstanding,
          }).catch((error) => {
            console.error(
              "Error saving financial data for year ",
              year,
              ": ",
              error
            );
            throw new Error(`Failed to save financial data for year ${year}`);
          });
        } else {
          throw new Error(`10-K report not found for year ${year}`);
        }
      }
    }
    const financialData = await fetchCashFlows(companyName, cik, latestYear);
    console.log("Final Financial Data: ", financialData);
    // Return the cash flow data to the client
    res.status(200).json({
      message: "Historical Financial Data Ready",
      data: {
        companyName,
        financialData: financialData.financialData,
        units: financialData.units,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/save-financial-data", async (req, res) => {
  try {
    const data = req.body;
    const savedData = await saveFinancialData(data);
    res.status(200).json({ message: "Financial Data Saved", data: savedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
