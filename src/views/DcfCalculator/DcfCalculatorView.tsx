import React, { useState } from "react";
import Button from "@mui/material/Button";
import "./DcfCalculatorView.css";
import { CircularProgress, styled } from "@mui/material";
import CompanyForm from "./CompanyForm";
import DcfInputs from "./DcfInputs";
import CashTable from "./CashTable";
import { generateFutureCashFlows } from "./Helpers";
import DataPresentation from "./DataPresentation";

const StyledButton = styled(Button)({
  margin: "0 10px",
});

type CompanyDataType = {
  symbol?: string;
  name?: string;
  exchange?: string;
  type?: string;
  cik?: string;
};

const FcfCalculatorView = () => {
  const [companyName, setCompanyName] = useState("");
  const [isValidCompany, setIsValidCompany] = useState<boolean>(false);
  const [companyData, setCompanyData] = useState<CompanyDataType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [financialDataResults, setFinancialDataResults] = useState<any>(null);
  const [amountUnits, setAmountUnits] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [growthRate, setGrowthRate] = useState<number | null>(5);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState<number | null>(
    5
  );
  const [discountRate, setDiscountRate] = useState<number | null>(7);
  const [futureFCF, setFutureFCF] = useState<any>(null);
  const avgFcf =
    financialDataResults?.reduce(
      (sum: number, entry: any) => sum + entry.freeCashFlow,
      0
    ) / financialDataResults?.length || 0;

  const updateCompanyTicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
  };
  // const newDate = new Date();
  const currentYear = new Date().getFullYear() - 1;
  // console.log("Current Year: ", currentYear);

  const handleVerify = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/usa/cik?company=" +
          encodeURIComponent(companyName)
      );
      const body = await response.json();
      console.log(body);
      setCompanyData(body.data);
      setIsValidCompany(true);
      setErrorMessage(null);
      setFinancialDataResults(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  //this function will call the backend to fetch the historical cash flow data
  const fetchCashFlows = async () => {
    // Send the verified company data to the backend for the whole DCF calculation
    try {
      setLoading(true);
      setFutureFCF(null);
      const response = await fetch(
        "http://localhost:8000/api/services/fetch-cash-flows",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: companyData.name,
            cik: companyData.cik,
            latestYear: currentYear,
          }),
        }
      );
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.message || "Failed to fetch cash flows from backend"
        );
      }
      const body = await response.json();
      console.log("Calculation Body: ", body);
      setFinancialDataResults(body.data.financialData);
      setAmountUnits(body.data.units);
      setErrorMessage(null);
      setLoading(false);
    } catch (error) {
      setErrorMessage("DCF Calculation Failed!!!: " + error.message);
      setLoading(false);
    }
  };

  const handleGenerateFutureCashFlows = () => {
    let generated;
    try {
      generated = generateFutureCashFlows(
        financialDataResults,
        growthRate,
        discountRate,
        currentYear
      );
      console.log("Generated Future Cash Flows: ", generated);

      setFutureFCF(generated);
    } catch (error) {
      setErrorMessage("Failed to generate future cash flows: " + error.message);
    }
  };

  const formatCurrency = (
    value: number | string | null | undefined,
    currency?: string
  ) => {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (isNaN(num)) return String(value);

    // If a 3-letter ISO currency code is provided, use Intl for proper formatting
    if (currency && /^[A-Z]{3}$/.test(currency)) {
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
        }).format(num);
      } catch (e) {
        // fall through to manual formatting
      }
    }

    const sign = num < 0 ? "-" : "";
    const abs = Math.abs(num);
    const formatted = abs.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sign}${currency ?? ""}${formatted}`;
  };

  const formState = {
    avgFcf,
    growthRate,
    discountRate,
    terminalGrowthRate,
    currency: financialDataResults ? financialDataResults[0]?.currency : "INR",
  };
  const formUpdateHandlers = {
    setGrowthRate,
    setDiscountRate,
    setTerminalGrowthRate,
    formatCurrency,
  };

  return (
    <div className="fcf-calculator-view">
      <CompanyForm
        companyName={companyName}
        updateCompanyTicker={updateCompanyTicker}
        handleVerify={handleVerify}
        companyData={companyData}
      />
      {companyData && (
        <StyledButton
          variant="contained"
          onClick={fetchCashFlows}
          disabled={!isValidCompany}
        >
          Fetch Cash Flows (5 yr)
        </StyledButton>
      )}
      <hr />
      <div className="fcf-results-section">
        {loading && <CircularProgress />}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {financialDataResults && (
          <>
            <CashTable
              financialData={financialDataResults}
              amountUnits={amountUnits}
              headers={[
                "Year",
                "Cash From Operations",
                "Capital Expenditures",
                "Free Cash Flow",
                "Units",
                "Currency",
              ]}
            />
            <div className="dcf-inputs">
              {/* <span>
                Average Free Cash Flow:{" "}
                {formatCurrency(avgFcf, financialDataResults[0]?.currency)}
              </span> */}
              <DcfInputs
                formState={formState}
                formUpdateHandlers={formUpdateHandlers}
              />
            </div>
            <StyledButton
              variant="contained"
              onClick={handleGenerateFutureCashFlows}
              disabled={!isValidCompany}
            >
              Generate Future Cash Flows
            </StyledButton>
            {futureFCF && (
              <DataPresentation
                cashFlowData={futureFCF}
                amountUnits={amountUnits}
                financialDataResults={financialDataResults}
                terminalGrowthRate={terminalGrowthRate}
                discountRate={discountRate}
                formatCurrency={formatCurrency}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FcfCalculatorView;
