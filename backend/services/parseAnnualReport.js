import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({});

/**
 * Calculates Free Cash Flow (FCF) by parsing a 10-K report URL via the Gemini API.
 * * @param {string} url - The URL of the 10-K report.
 * @returns {Promise<number>} - The calculated FCF value.
 */
// need to add exponential backoff retry logic here
async function parseAnnualReport(url) {
  const model = "gemini-2.5-flash";

  // The detailed prompt for structured data extraction
  const prompt = `
        Act as a strict Financial Data Extractor. Your only job is to extract raw numerical values from the 10-K report at the following URL: ${url}.

Do NOT perform any calculations. Do NOT attempt to derive ratios. 
Extract the values exactly as they appear in the columns for the MOST RECENT COMPLETED FISCAL YEAR.

### STEP 1: DETECT SCALE & CURRENCY
Look at the top of the financial tables (Balance Sheet, Income Statement, Cash Flow). 
- Identify the Reporting Unit (e.g., "in millions", "in thousands", "in whole dollars").
- Identify the Currency (e.g., USD, EUR).

### STEP 2: EXTRACT RAW LINE ITEMS
Locate the specific tables and extract the following raw numbers. If a specific exact term is not found, look for the synonyms provided in brackets.

FROM THE CONSOLIDATED BALANCE SHEETS:
1. "Total Assets"
2. "Total Liabilities"
3. "Total Stockholders' Equity" [Synonyms: Total Shareholders' Equity, Total Equity, Total Deficit]
4. "Cash and Cash Equivalents"
5. "Short-term Debt" [Synonyms: Short-term borrowings, Current portion of long-term debt, Notes payable]
   *If multiple lines exist (e.g., "Current portion of LT debt" AND "Short-term borrowings"), SUM them mentally or extract the largest one representing total short-term interest-bearing debt. If none, return 0.*
6. "Long-term Debt" [Synonyms: Long-term borrowings, Notes payable less current portion]

FROM THE CONSOLIDATED STATEMENTS OF CASH FLOWS:
7. "Net Cash Provided by Operating Activities" [Synonyms: Net cash from operations, Cash flow from operating activities]
8. "Capital Expenditures" [Synonyms: Additions to property, plant and equipment, Purchases of property, plant and equipment] 
   *Note: This is usually a negative number in the table. Extract it as the absolute POSITIVE value.*

FROM THE CONSOLIDATED STATEMENTS OF OPERATIONS (INCOME STATEMENT):
9. "Weighted Average Shares Outstanding - Diluted" [Synonyms: Diluted weighted average common shares]

### STEP 3: OUTPUT FORMAT
Provide the output STRICTLY in the following JSON format. 
- 'unit_multiplier': Return 1000000 for "millions", 1000 for "thousands", 1 for "whole".
- 'currency': ISO code (e.g., "USD").
- All value fields must be NUMBERS (no commas, no strings).

{
  "metaData": {
    "unitMultiplier": [Number, e.g., 1000000],
    "currency": "[String]",
    "source": "${url}"
  },
  "financeData": {
    "totalAssets": [Number],
    "totalLiabilities": [Number],
    "totalEquity": [Number],
    "cashAndEquivalents": [Number],
    "shortTermDebt": [Number],
    "longTermDebt": [Number],
    "cashFromOperatingActivities": [Number],
    "capitalExpenditures": [Number],
    "sharesOutstanding": [Number]
  }
}

    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const jsonText = response.text.trim();
    // Find the JSON block (often wrapped in markdown fences) and parse it.
    // A simple method is to try and find the content between the first { and last }
    const jsonStart = jsonText.indexOf("{");
    const jsonEnd = jsonText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Model did not return the expected JSON structure.");
    }

    const extractedJson = jsonText.substring(jsonStart, jsonEnd);
    const data = JSON.parse(extractedJson);
    console.log("Extracted Data: ", data);

    if (
      isNaN(data.financeData.cashFromOperatingActivities) ||
      isNaN(data.financeData.capitalExpenditures)
    ) {
      throw new Error("Extracted values are not valid numbers.");
    }

    return data;
  } catch (error) {
    console.error("Error calculating FCF: ", error.message);
    return new Error("Failed to parse annual report: " + error.message);
  }
}

export default parseAnnualReport;
