import { Card, CardContent, Input, Stack, TextField } from "@mui/material";
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
    avgFcf,
    growthRate,
    discountRate,
    terminalGrowthRate,
    isValidCompany,
    handleGenerateFutureCashFlows,
  } = formState;
  const {
    setGrowthRate,
    setDiscountRate,
    setTerminalGrowthRate,
    formatCurrency,
  } = formUpdateHandlers;
  return (
    <Card className="dcf-inputs-card" style={{ margin: "8px" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            alignContent="center"
            alignItems="center"
          >
            <span>Growth Rate: </span>
            <TextField
              type="number"
              value={growthRate}
              onChange={(e) => setGrowthRate(Number(e.target.value))}
              placeholder="Growth Rate"
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <span>Discount Rate: </span>
            <TextField
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              placeholder="Discount Rate"
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <span>Terminal Growth Rate: </span>
            <TextField
              type="number"
              value={terminalGrowthRate}
              onChange={(e) => setTerminalGrowthRate(Number(e.target.value))}
              placeholder="Terminal Growth Rate"
            />
          </Stack>
          <StyledButton
            variant="contained"
            onClick={handleGenerateFutureCashFlows}
            disabled={!isValidCompany}
          >
            Generate Future Cash Flows
          </StyledButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DcfInputs;
