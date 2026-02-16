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
  const { avgFcf, growthRate, discountRate, terminalGrowthRate, currency } =
    formState;
  const {
    setGrowthRate,
    setDiscountRate,
    setTerminalGrowthRate,
    formatCurrency,
  } = formUpdateHandlers;
  return (
    <div className="dcf-inputs-section">
      <StyledChip label={`Average FCF: ${formatCurrency(avgFcf, currency)}`} />
      <div>
        <span>Growth Rate: </span>
        <Input
          type="number"
          value={growthRate}
          onChange={(e) => setGrowthRate(Number(e.target.value))}
          placeholder="Growth Rate"
        />
      </div>
      <div>
        <span>Discount Rate: </span>
        <Input
          type="number"
          value={discountRate}
          onChange={(e) => setDiscountRate(Number(e.target.value))}
          placeholder="Discount Rate"
        />
      </div>
      <div>
        <span>Terminal Growth Rate: </span>
        <Input
          type="number"
          value={terminalGrowthRate}
          onChange={(e) => setTerminalGrowthRate(Number(e.target.value))}
          placeholder="Terminal Growth Rate"
        />
      </div>
    </div>
  );
};

export default DcfInputs;
