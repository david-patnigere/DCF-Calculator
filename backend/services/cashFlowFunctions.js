import CompanyFinancialData from "../models/CompanyFinancialData.js";

export async function saveFinancialData(data) {
  try {
    // checking if entry for company already exists
    const companyExists = await CompanyFinancialData.findOne({
      companyName: data.companyName,
    });
    console.log("Company Exists: ", companyExists);

    if (companyExists) {
      // check if reportYear entry exists
      const yearEntryIndex = companyExists.financialData.findIndex(
        (entry) => entry.reportYear === data.reportYear
      );
      console.log("Year Entry Index: ", yearEntryIndex);

      if (yearEntryIndex === -1) {
        // add new year entry
        const addingNewYear = await CompanyFinancialData.updateOne(
          { companyName: data.companyName },
          {
            $push: {
              financialData: {
                reportYear: data.reportYear,
                cashFromOperatingActivities: data.cashFromOperatingActivities,
                capitalExpenditures: data.capitalExpenditures,
                unit: data.unit,
                currency: data.currency,
                debtRatio: data.debtRatio,
                equityRatio: data.equityRatio,
                netDebt: data.netDebt,
                sharesOutstanding: data.sharesOutstanding,
              },
              $sort: { "financialData.reportYear": -1 },
            },
          }
        );
        console.log("Adding New Year Entry: ", addingNewYear);
      }
    } else {
      // create new company entry
      const newCompanyCashFlow = new CompanyFinancialData({
        companyName: data.companyName,
        id: data.cik,
        financialData: [
          {
            reportYear: data.reportYear,
            cashFromOperatingActivities: data.cashFromOperatingActivities,
            capitalExpenditures: data.capitalExpenditures,
            unit: data.unit,
            currency: data.currency,
            debtRatio: data.debtRatio,
            equityRatio: data.equityRatio,
            netDebt: data.netDebt,
            sharesOutstanding: data.sharesOutstanding,
          },
        ],
      });
      const saveData = await newCompanyCashFlow.save();
      console.log("New Company Financial Data Saved: ", saveData);
      return saveData;
    }
  } catch (error) {
    console.error("Error saving Financial Data: ", error);
  }
}

export async function fetchCashFlows(companyName, cik, latestYear) {
  let units = null;
  try {
    const companyData = await CompanyFinancialData.findOne({
      companyName: companyName,
    });
    const financialData = companyData.financialData.filter(
      (entry) =>
        entry.reportYear <= latestYear && entry.reportYear > latestYear - 5
    );
    const updatedFinancialData = financialData.map((entry) => {
      units = units || entry.unit; // set units if not already set
      return {
        reportYear: entry.reportYear,
        cashFromOperatingActivities: entry.cashFromOperatingActivities,
        capitalExpenditures: entry.capitalExpenditures,
        freeCashFlow:
          entry.cashFromOperatingActivities - entry.capitalExpenditures,
        unit: entry.unit,
        currency: entry.currency,
        debtRatio: entry.debtRatio,
        equityRatio: entry.equityRatio,
        netDebt: entry.netDebt,
        sharesOutstanding: entry.sharesOutstanding,
      };
    });
    console.log("Fetched Cash Flows: ", updatedFinancialData);
    return { financialData: updatedFinancialData, units };
  } catch (error) {
    console.error("Error fetching Financial data: ", error);
    return { financialData: null, error: error };
  }
}
