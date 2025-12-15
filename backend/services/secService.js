import axios from "axios";

const USER_AGENT = "rogermerillin@gmail.com"; // Required by SEC

// Normalize CIK to 10 digits
const padCIK = (cik) => cik.toString().padStart(10, "0");

/**
 * STEP 1 — Search for company CIK
 * SEC provides a company search JSON file
 */
export async function searchCIK(companyName) {
  try {
    const url = "https://www.sec.gov/files/company_tickers_exchange.json";

    const { data } = await axios.get(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    const entries = Object.values(data.data);
    // console.log("Total companies in SEC database: ", entries);
    // console.log(data);

    const match = entries.find((c) =>
      c[1].toLowerCase().includes(companyName.toLowerCase())
    );

    console.log(match);

    return match ? { name: match[1], cik: padCIK(match[0]) } : null;
  } catch (error) {
    console.error("Error searching for CIK: ", error);
    return null;
  }
}

/**
 * STEP 2 — Fetch the latest 10-K annual report
 * We use the CIK and query: /submissions/CIK######
 */
export async function fetchLatest10K(cik, year) {
  const url = `https://data.sec.gov/submissions/CIK${cik}.json`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  // Look for 10-K filings inside "filings.recent"
  const filings = data.filings.recent;

  for (let i = 0; i < filings.form.length; i++) {
    if (filings.form[i] === "10-K" && filings.filingDate[i].startsWith(year)) {
      const accession = filings.accessionNumber[i].replace(/-/g, "");
      const primaryDoc = filings.primaryDocument[i];

      return {
        form: "10-K",
        filingDate: filings.filingDate[i],
        reportURL: `https://www.sec.gov/Archives/edgar/data/${parseInt(
          cik
        )}/${accession}/${primaryDoc}`,
      };
    }
  }

  return null;
}
