import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./FcfCalculatorView.css";
import { Chip, styled } from "@mui/material";

const StyledChip = styled(Chip)({
  padding: "1rem",
  margin: "10px",
});

const FcfCalculatorView = () => {
  const [companyName, setCompanyName] = useState("");
  const [isValidCompany, setIsValidCompany] = useState<boolean>(false);
  const [companyTicker, setCompanyTicker] = useState("");

  const updateCompanyTicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
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
        setCompanyTicker(body.data.symbol);
      } else {
        setIsValidCompany(false);
        setCompanyTicker("");
      }
      console.log(body);
    } catch (err) {
      // window.alert("Error verifying company ticker.");
      setIsValidCompany(false);
      setCompanyTicker("");
    }
  };

  const handleFetchAR = () => {};

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
        <StyledChip label={companyTicker} color="primary" variant="outlined" />
        <Button
          variant="contained"
          onClick={handleFetchAR}
          disabled={!isValidCompany}
        >
          Fetch Latest Annual Report
        </Button>
        <hr />
      </div>
      <div className="fcf-results-section">
        Results for FCF Calculations will go here.
      </div>
    </div>
  );
};

export default FcfCalculatorView;
