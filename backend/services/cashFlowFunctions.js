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
                metaData: {
                  unitMultiplier: data.metaData.unitMultiplier,
                  currency: data.metaData.currency,
                  source: data.metaData.source,
                },
                financeData: {
                  cashFromOperatingActivities:
                    data.financeData.cashFromOperatingActivities,
                  capitalExpenditures: data.financeData.capitalExpenditures,
                  totalAssets: data.financeData.totalAssets,
                  totalLiabilities: data.financeData.totalLiabilities,
                  totalEquity: data.financeData.totalEquity,
                  cashAndEquivalents: data.financeData.cashAndEquivalents,
                  shortTermDebt: data.financeData.shortTermDebt,
                  longTermDebt: data.financeData.longTermDebt,
                  sharesOutstanding: data.financeData.sharesOutstanding,
                },
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
            metaData: {
              unitMultiplier: data.metaData.unitMultiplier,
              currency: data.metaData.currency,
              source: data.metaData.source,
            },
            financeData: {
              cashFromOperatingActivities:
                data.financeData.cashFromOperatingActivities,
              capitalExpenditures: data.financeData.capitalExpenditures,
              totalAssets: data.financeData.totalAssets,
              totalLiabilities: data.financeData.totalLiabilities,
              totalEquity: data.financeData.totalEquity,
              cashAndEquivalents: data.financeData.cashAndEquivalents,
              shortTermDebt: data.financeData.shortTermDebt,
              longTermDebt: data.financeData.longTermDebt,
              sharesOutstanding: data.financeData.sharesOutstanding,
            },
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
      units = units || entry.metaData.unitMultiplier; // set units if not already set
      return {
        reportYear: entry.reportYear,
        cashFromOperatingActivities:
          entry.financeData.cashFromOperatingActivities,
        capitalExpenditures: entry.financeData.capitalExpenditures,
        freeCashFlow:
          entry.financeData.cashFromOperatingActivities -
          entry.financeData.capitalExpenditures,
        unit: entry.metaData.unitMultiplier,
        currency: entry.metaData.currency,
        debtRatio:
          entry.financeData.totalLiabilities / entry.financeData.totalAssets,
        equityRatio:
          entry.financeData.totalEquity / entry.financeData.totalAssets,
        netDebt:
          entry.financeData.totalLiabilities -
          entry.financeData.cashAndEquivalents,
        sharesOutstanding: entry.financeData.sharesOutstanding,
      };
    });
    console.log("Fetched Cash Flows: ", updatedFinancialData);
    return { financialData: updatedFinancialData, units };
  } catch (error) {
    console.error("Error fetching Financial data: ", error);
    return { financialData: null, error: error };
  }
}
