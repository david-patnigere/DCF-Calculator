import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React from "react";

const StyledChip = styled(Chip)({
  padding: "1rem",
  margin: "10px",
});

const CompanyForm = ({
  companyName,
  updateCompanyTicker,
  handleVerify,
  companyData,
}) => {
  return (
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
      {companyData && (
        <StyledChip
          label={companyData.name}
          color="primary"
          variant="outlined"
        />
      )}
    </div>
  );
};

export default CompanyForm;
