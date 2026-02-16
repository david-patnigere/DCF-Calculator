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
        You are a financial statement extraction engine.

STRICT INSTRUCTIONS:
- Use ONLY the data explicitly stated in the 10-K document available at the provided URL.
- DO NOT estimate, approximate, interpolate, or infer missing values.
- DO NOT calculate ratios unless all components are explicitly found in the document.
- If a required value is not explicitly available, return null.
- Use the MOST RECENT fiscal year column only.
- Use CONSOLIDATED financial statements only (not parent-only statements).
- Use the primary Statement of Cash Flows, Balance Sheet, and Notes if required.

TASK:

From the 10-K report at the following URL: ${url},

Extract the following values for the MOST RECENT fiscal year:

1) Cash Flow from Operating Activities (CFO)
   - Exact line item typically labeled:
     "Net cash provided by operating activities"
   - Must come from the Statement of Cash Flows.

2) Capital Expenditures (CapEx)
   - Exact line item typically labeled:
     "Purchases of property, plant and equipment"
     OR
     "Capital expenditures"
   - Must come from the Statement of Cash Flows under Investing Activities.
   - Return CapEx as a POSITIVE number (absolute value).

3) Debt Ratio
   - If explicitly provided in the report, extract it.
   - If not explicitly provided, calculate as:
     Total Liabilities / Total Assets
   - Use values from the Consolidated Balance Sheet.

4) Equity Ratio
   - If explicitly provided in the report, extract it.
   - If not explicitly provided, calculate as:
     Total Shareholders’ Equity / Total Assets

5) Net Debt
   - Calculate as:
     Total Debt (Short-term Debt + Long-term Debt)
     MINUS
     Cash and Cash Equivalents
   - All components must be explicitly found in the Balance Sheet or Notes.

6) Shares Outstanding
   - Extract from:
     "Weighted-average shares outstanding (basic)"
     OR
     "Common shares outstanding"
   - Use the most recent fiscal year.

UNITS & CURRENCY:
- Identify the unit stated in the financial statements header (e.g., "in millions", "in thousands").
- DO NOT convert the values.
- Preserve the reported unit exactly as written.
- Identify the reporting currency exactly as written.

VALIDATION:
- Ensure extracted numbers match exactly what is printed in the report.
- Ensure signs are correct (except CapEx must be returned as positive).
- Do NOT include commas or currency symbols.
- Return ONLY numeric values.

If any required item cannot be located explicitly, return null for that field.

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "unit": "",
  "cfo_value": 0,
  "capex_value": 0,
  "debt_ratio": 0,
  "equity_ratio": 0,
  "net_debt": 0,
  "shares_outstanding": 0,
  "currency": ""
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
