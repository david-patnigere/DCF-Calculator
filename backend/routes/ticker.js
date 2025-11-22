const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const YahooFinanceModule = require("yahoo-finance2").default;
const dotenv = require("dotenv");
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

      return JSON.stringify({
        symbol: bestMatch.symbol,
        name: bestMatch.shortName || bestMatch.longName,
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

module.exports = tickerRouter;
