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
  symbol: string;
  name: string;
  exchange: string;
  type: string;
};

const FcfCalculatorView = () => {
  const [companyName, setCompanyName] = useState("");
  const [isValidCompany, setIsValidCompany] = useState<boolean>(false);
  const [companyData, setCompanyData] = useState<CompanyDataType | null>(null);
  const [reportYear, setReportYear] = useState(2025);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateCompanyTicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
  };

  const yearOptions = [2025, 2024, 2023, 2022, 2021];

  const changeYear = (newYear: number) => {
    setReportYear(newYear);
  };

  const handleVerify = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    // window.alert("verifying: " + companyName);
    try {
      let response = await fetch(`http://localhost:8000/api/get-ticker-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      let body = await response.json();
      if (body?.data.symbol) {
        setIsValidCompany(true);
        setCompanyData(body.data);
        setErrorMessage(null);
      } else {
        setIsValidCompany(false);
        setCompanyData(null);
      }
      console.log(body);
    } catch (err) {
      // window.alert("Error verifying company ticker.");
      setIsValidCompany(false);
      setCompanyData(null);
      setErrorMessage(err);
    }
  };

  const handleFetchAR = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/analyze-annual-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: companyData.name,
            reportYear,
            ticker: companyData.symbol,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setErrorMessage(error);
    }
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
          label={companyData?.symbol}
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
        <hr />
      </div>
      <div className="fcf-results-section">
        {reportYear - 1}-{reportYear % 100} Results for FCF Calculations will go
        here.
      </div>
    </div>
  );
};

export default FcfCalculatorView;
