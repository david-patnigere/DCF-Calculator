import express from "express";
import { isCompanyDataComplete } from "../../services/dataChecks.js";
import calculateFCF from "../../services/fcfCalc.js";
import { saveCashFlowData } from "../../services/saveCashFlow.js";
import { fetchLatest10K } from "../../services/secService.js";

const router = express.Router();

router.post("/calculate-dcf", async (req, res) => {
  try {
    const { companyName, cik, latestYear } = req.body;
    console.log("Received DCF Calculation Request: ", req.body);
    const dataCheck = await isCompanyDataComplete(companyName, cik, latestYear);
    console.log("Data Check Result: ", dataCheck);

    if (!dataCheck.companyPresent || !dataCheck.dataComplete) {
      for (const year of dataCheck.missingYears) {
        console.log(`Fetching missing data for year: ${year}`);
        const report = await fetchLatest10K(cik, year);
        if (report) {
          console.log(`Fetched Report for Year ${year}: `, report.reportURL);
          const fcfResult = await calculateFCF(report.reportURL);
          console.log("Calculated FCF Result: ", fcfResult);
          await saveCashFlowData({
            companyName: companyName,
            cik: cik,
            reportYear: year,
            cfo: fcfResult.cfo,
            capex: fcfResult.capex,
            unit: fcfResult.unit,
            currency: fcfResult.currency,
          });
        } else {
          throw new Error(`10-K report not found for year ${year}`);
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/save-cash-flow", async (req, res) => {
  try {
    const data = req.body;
    const savedData = await saveCashFlowData(data);
    res.status(200).json({ message: "Cash Flow Data Saved", data: savedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
