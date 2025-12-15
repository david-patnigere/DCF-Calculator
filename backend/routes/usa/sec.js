import express from "express";
import { searchCIK, fetchLatest10K } from "../../services/secService.js";

const router = express.Router();

router.get("/cik", async (req, res) => {
  try {
    const company = req.query.company;
    if (!company) {
      return res.status(400).json({ error: "Missing ?company=" });
    }

    // Step 1: search for CIK
    const companyData = await searchCIK(company);
    console.log("Found Company Data: ", companyData);

    if (!companyData)
      return res
        .status(404)
        .json({ error: "Company not found in SEC database" });

    return res.status(200).json({ message: "Success", data: companyData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sec/annual-report?company=Apple
router.post("/annual-report", async (req, res) => {
  try {
    const company = req.body.companyName;
    const reportYear = req.body.reportYear;
    const cik = req.body.cik;
    if (!company || !cik) {
      return res
        .status(400)
        .json({ error: "Missing company or cik parameter" });
    }

    // Step 2: fetch latest 10-K Annual Report
    const report = await fetchLatest10K(cik, reportYear);

    if (!report)
      return res.status(404).json({ error: "10-K annual report not found" });

    console.log("Fetched Annual Report: ", report);

    res.status(200).json({
      company,
      cik,
      annualReport: report,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
