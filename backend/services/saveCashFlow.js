import CompanyCashFlow from "../models/CompanyCashFlow.js";

export async function saveCashFlowData(data) {
  try {
    // checking if entry for company already exists
    const companyExists = await CompanyCashFlow.findOne({
      companyName: data.companyName,
    });
    console.log("Company Exists: ", companyExists);

    if (companyExists) {
      // check if reportYear entry exists
      const yearEntryIndex = companyExists.cashFlowData.findIndex(
        (entry) => entry.reportYear === data.reportYear
      );
      console.log("Year Entry Index: ", yearEntryIndex);

      if (yearEntryIndex === -1) {
        // add new year entry
        const addingNewYear = await CompanyCashFlow.updateOne(
          { companyName: data.companyName },
          {
            $push: {
              cashFlowData: {
                reportYear: data.reportYear,
                cashFromOperatingActivities: data.cfo,
                capitalExpenditures: data.capex,
                unit: data.unit,
                currency: data.currency,
              },
              $sort: { "cashFlowData.reportYear": -1 },
            },
          }
        );
        console.log("Adding New Year Entry: ", addingNewYear);
      }
    } else {
      // create new company entry
      const newCompanyCashFlow = new CompanyCashFlow({
        companyName: data.companyName,
        id: data.cik,
        cashFlowData: [
          {
            reportYear: data.reportYear,
            cashFromOperatingActivities: data.cfo,
            capitalExpenditures: data.capex,
            unit: data.unit,
            currency: data.currency,
          },
        ],
      });
      const saveData = await newCompanyCashFlow.save();
      console.log("New Company Cash Flow Data Saved: ", saveData);
      return saveData;
    }
  } catch (error) {
    console.error("Error saving Cash Flow data: ", error);
  }
}
