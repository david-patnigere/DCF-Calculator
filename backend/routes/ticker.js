import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import YahooFinanceModule from "yahoo-finance2";
import dotenv from "dotenv";
import analyzeCompanyAnnualReport from "./report-download.js";

const yahooFinance = new YahooFinanceModule();
dotenv.config();

const tickerRouter = express.Router();
// const client = new openai({ apiKey: process.env.OPENAI_API_KEY });

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTickerSymbol(companyName) {
  console.log("Trying Yahoo Search");
  try {
    const results = await yahooFinance.search(companyName);

    if (results && results.count > 0) {
      // Find the first result that is listed on NSE or BSE
      const indianStockResult = results.quotes.find(
        (quote) =>
          quote.symbol.endsWith(".BO") || quote.exchange.endsWith(".NS")
      );
      const bestMatch = indianStockResult || results.quotes[0];
      console.log("BEst Match is: ", bestMatch);

      return JSON.stringify({
        symbol: bestMatch.symbol,
        name: bestMatch.longname,
        exchange: bestMatch.exchange,
        type: bestMatch.quoteType,
      });
    }
  } catch (error) {
    console.error("Error searching for ticker symbol: ", error);
    return JSON.stringify({ error: "Error retrieving ticker symbol" });
  }
}

tickerRouter.post("/get-ticker-info", async (req, res) => {
  try {
    const { companyName } = req.body;
    // check if companyName is not empty and is not just whitespace
    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({ error: "Invalid company name" });
    }
    console.log("Fetching ticker for company: ", companyName);
    const data = await getTickerSymbol(companyName);

    console.log("Received ticker data: ", data);
    console.log(typeof data);
    return res.status(200).json({
      message: "Success",
      data: JSON.parse(data),
    });
  } catch (error) {
    console.error("Error fetching ticker info: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve ticker information" });
  }
});

tickerRouter.post("/analyze-annual-report", async (req, res) => {
  try {
    const companyName = req.body.companyName;
    const reportYear = req.body.reportYear;
    const ticker = req.body.ticker;

    if (!companyName || companyName.trim().length < 2) {
      res.status(400).json({ error: "Invalid Company Name!" });
    }
    if (!reportYear) {
      res.status(400).json({ error: "Invalid Year!" });
    }

    console.log("Fetching and Analyzing Annual Report....");
    analyzeCompanyAnnualReport(companyName, reportYear, ticker);
  } catch (error) {
    console.log("Error in Analyzing Annual Report!!! Details: ", error.message);
  }
});

export default tickerRouter;
