import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import React from "react";
import Dropdown from "./Dropdown";

const StyledChip = styled(Chip)({
  padding: "1rem",
  margin: "10px",
});

const StyledButton = styled(Button)({
  margin: "0 10px",
});

const DcfInputs = ({
  isValidCompany,
  companyName,
  reportYear,
  yearOptions,
  changeYear,
  calculateDcf,
  errorMessage,
}) => {
  return (
    <div className="annual-report-section" hidden={!isValidCompany}>
      <StyledChip label={companyName} color="primary" variant="outlined" />
      <Dropdown
        label="Report Year"
        value={reportYear}
        options={yearOptions}
        onChange={changeYear}
      />
      <StyledButton
        variant="contained"
        onClick={calculateDcf}
        disabled={!isValidCompany}
      >
        Calculate DCF (5 yr)
      </StyledButton>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <hr />
    </div>
  );
};

export default DcfInputs;
