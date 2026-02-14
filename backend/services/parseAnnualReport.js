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
        From the 10-K report available at the following URL: ${url}, 
        extract the financial data from the Statement of Cash Flows for the MOST RECENT fiscal year.

        I need four specific values:
        1. Cash Flow from Operating Activities (CFO)
        2. Capital Expenditures (CapEx) - usually listed under Cash Flow from Investing Activities as 'Purchases of Property, Plant, and Equipment'. 
           Please provide CapEx as a POSITIVE numerical value.
        3. The Debt Ratio usually found in the Balance Sheet or Notes to Financial Statements.
        4. The Equity Ratio usually found in the Balance Sheet or Notes to Financial Statements.
        5. The Net Debt of the company in the current year.
        6. The Number of Shares Outstanding for the current year.

        Additionally, please provide the units (e.g., In Millions, In Thousands) and the currency (e.g., USD) used in the report.

        Provide the output STRICTLY in the following JSON format. Ensure all values are numerical 
        (no commas, currency symbols, or trailing text). If the 10-K uses 'in thousands', provide the value in thousands:

        {
          "unit": "[e.g., In Millions or In Thousands]",
          "cfo_value": [CFO Numerical Value],
          "capex_value": [CapEx Numerical Value],
          "debt_ratio": [Debt Ratio Value],
          "equity_ratio": [Equity Ratio Value],
          "net_debt": [Net Debt Value],
          "shares_outstanding": [Shares Outstanding Value],
          "currency": "[e.g., USD]"
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

    if (isNaN(data.cfo_value) || isNaN(data.capex_value)) {
      throw new Error("Extracted values are not valid numbers.");
    }

    return {
      cashFromOperatingActivities: data.cfo_value,
      capitalExpenditures: data.capex_value,
      unit: data.unit,
      currency: data.currency,
      debtRatio: data.debt_ratio,
      equityRatio: data.equity_ratio,
      netDebt: data.net_debt,
      sharesOutstanding: data.shares_outstanding,
    };
  } catch (error) {
    console.error("Error calculating FCF: ", error.message);
  }
}

export default parseAnnualReport;
