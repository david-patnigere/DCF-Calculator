import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./FcfCalculatorView.css";
import { Chip, styled } from "@mui/material";
import Dropdown from "./Dropdown";

const StyledChip = styled(Chip)({
  padding: "1rem",
  margin: "10px",
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
  const [reportYear, setReportYear] = useState(2025);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fcfResults, setFcfResults] = useState<any>(null);

  const updateCompanyTicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
  };

  const yearOptions = [2025, 2024, 2023, 2022, 2021];

  const changeYear = (newYear: number) => {
    setReportYear(newYear);
  };

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
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleFetchAR = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/usa/annual-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: companyData.name,
            reportYear,
            cik: companyData.cik,
          }),
        }
      );
      const data = await response.json();
      setErrorMessage(null);
      console.log(data);
      setFcfResults(data);
    } catch (error) {
      setErrorMessage(error.message);
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

  return (
    <div className="fcf-calculator-view">
      <div className="company-input">
        <TextField
          id="company-name-input"
          placeholder="Enter Company Name"
          label="Company Name"
          variant="outlined"
          value={companyName}
          onChange={updateCompanyTicker}
          style={{ padding: "0.5rem" }}
          className="company-text-input"
        />
        <Button variant="contained" onClick={handleVerify}>
          Verify Company Name
        </Button>
      </div>
      <div className="annual-report-section" hidden={!isValidCompany}>
        <StyledChip
          label={companyData?.name}
          color="primary"
          variant="outlined"
        />
        <Dropdown
          label="Report Year"
          value={reportYear}
          options={yearOptions}
          onChange={changeYear}
        />
        <Button
          variant="contained"
          onClick={handleFetchAR}
          disabled={!isValidCompany}
        >
          Fetch Annual Report
        </Button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <hr />
      </div>
      <div className="fcf-results-section">
        {reportYear - 1}-{reportYear % 100} Results for FCF Calculations will go
        here.
        {fcfResults && (
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Company Name</td>
                <td>{companyData?.name}</td>
              </tr>
              <tr>
                <td>Cash From Operating Activities</td>
                <td>{formatCurrency(fcfResults?.cfo, fcfResults?.currency)}</td>
              </tr>
              <tr>
                <td>Capital Expenditures</td>
                <td>
                  {formatCurrency(fcfResults?.capex, fcfResults?.currency)}
                </td>
              </tr>
              <tr>
                <td>Free Cash Flow</td>
                <td>{formatCurrency(fcfResults?.fcf, fcfResults?.currency)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FcfCalculatorView;
