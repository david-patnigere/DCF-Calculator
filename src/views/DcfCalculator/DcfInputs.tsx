import { Input } from "@mui/material";
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

const DcfInputs = ({ formState, formUpdateHandlers }) => {
  const {
    isValidCompany,
    companyName,
    reportYear,
    yearOptions,
    errorMessage,
    growthRate,
    discountRate,
  } = formState;
  const { changeYear, setGrowthRate, setDiscountRate, calculateDcf } =
    formUpdateHandlers;
  return <div className="annual-report-section" hidden={!isValidCompany}></div>;
};

export default DcfInputs;
