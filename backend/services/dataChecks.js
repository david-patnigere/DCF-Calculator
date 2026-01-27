import CompanyCashFlow from "../models/CompanyCashFlow.js";

export async function isCompanyDataComplete(companyName, cik, latestYear) {
  let response = {};
  const yearsToCheck = [
    latestYear,
    latestYear - 1,
    latestYear - 2,
    latestYear - 3,
    latestYear - 4,
  ];
  const companyData = await CompanyCashFlow.findOne({
    companyName: companyName,
    id: cik,
  });
  if (!companyData) {
    return {
      companyPresent: false,
      dataComplete: false,
      missingYears: yearsToCheck,
    };
  } else {
    console.log("Company Found", companyData.companyName);
    const yearEntries = companyData.cashFlowData
      .filter((entry) => yearsToCheck.includes(entry.reportYear))
      .map((entry) => entry.reportYear);
    console.log("Year Entries Found: ", yearEntries);
    if (yearEntries.length < 5) {
      return {
        companyPresent: true,
        dataComplete: false,
        missingYears: yearsToCheck.filter(
          (year) => !yearEntries.includes(year)
        ),
      };
    }
  }
  return { companyPresent: true, dataComplete: true };
}
