import { fetchCashFlows } from "./cashFlowFunctions.js";

export async function calculateDCF(
  companyName,
  cik,
  latestYear,
  growthRate,
  discountRate
) {
  // Fetch the 5 year cash flow data from database
  const fiveYearCashFlows = await fetchCashFlows(companyName, cik, latestYear);
  const avgFCF =
    fiveYearCashFlows.reduce((sum, entry) => sum + entry.freeCashFlow, 0) /
    fiveYearCashFlows.length;
  // Get the Net Present Value (NPV) of the cash flows
  const futureCashFlows = fiveYearCashFlows.map((entry, index) => {
    const year = index + 1;
    const projectedFCF = avgFCF * Math.pow(1 + growthRate / 100, year);
    const presentValue = projectedFCF / Math.pow(1 + discountRate / 100, year);
    return {
      year: latestYear + year,
      projectedFCF,
      presentValue,
    };
  });

  const terminalValuePV =
    (futureCashFlows[futureCashFlows.length - 1].projectedFCF *
      (1 + growthRate / 100)) /
    ((discountRate - growthRate) / 100);

  const sumOfPV =
    futureCashFlows.reduce((sum, entry) => sum + entry.presentValue, 0) +
    terminalValuePV;
}
