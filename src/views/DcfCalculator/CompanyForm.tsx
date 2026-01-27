import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";

const CompanyForm = ({ companyName, updateCompanyTicker, handleVerify }) => {
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
    </div>
  );
};

export default CompanyForm;
