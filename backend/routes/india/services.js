import axios from "axios";
import express from "express";

const router = express.Router();

router.get("/ticker", async (req, res) => {
  try {
    const ticker = await getScreenerTicker(req.query.company);
    console.log(ticker);
    if (ticker) {
      res.status(200).json({ message: "Success", data: { ...ticker } });
    } else {
      res.status(404).json({ error: "Ticker not found for the company" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/fetch-financial-data", async (req, res) => {
  return null;
});

const getScreenerTicker = async (companyName) => {
  try {
    const url = `https://www.screener.in/api/company/search/?q=${encodeURIComponent(
      companyName,
    )}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const companies = response.data;
    // console.log("Screener Search Response: ", companies);
    return companies[0];
  } catch (error) {
    console.error("Error fetching ticker from Screener: ", error);
    return null;
  }
};

export default router;
