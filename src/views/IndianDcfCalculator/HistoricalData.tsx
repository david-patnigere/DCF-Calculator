import { Card, CardContent, Stack, Chip, Typography } from "@mui/material";
import CashTable from "./CashTable";

const HistoricalData = ({
  financialDataResults,
  amountUnits,
  avgFcf,
  formatCurrency,
}) => {
  if (!financialDataResults || financialDataResults.length === 0) {
    return <div></div>;
  }
  return (
    <Card className="historical-data-card">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Cash Flow History</Typography>
          <CashTable
            financialData={financialDataResults}
            amountUnits={amountUnits}
            headers={[
              "Year",
              "Cash From Operations",
              "Capital Expenditures",
              "Free Cash Flow",
              "Currency",
              "Units",
            ]}
          />

          <Typography variant="subtitle1" fontWeight={600}>
            Average Free Cash Flow:{" "}
            {formatCurrency(
              avgFcf,
              financialDataResults[0]?.currency,
              amountUnits
            )}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default HistoricalData;
