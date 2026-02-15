import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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

const CashTable = ({ financialData, amountUnits, headers }) => {
  const cashFlowData = financialData.map((entry: any) => {
    return {
      reportYear: entry.reportYear,
      cashFromOperatingActivities: entry.cashFromOperatingActivities,
      capitalExpenditures: entry.capitalExpenditures,
      freeCashFlow: entry.freeCashFlow,
      currency: entry.currency,
      units: amountUnits,
    };
  });
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {headers.map((header: string, index: number) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {cashFlowData.map((result: any, index: number) => (
            <TableRow key={index}>
              {Object.keys(result).map((key: string) => {
                // if (key !== "reportYear") {
                return (
                  <TableCell key={key} align="center">
                    {key !== "reportYear"
                      ? formatCurrency(result[key], result.currency)
                      : result[key]}
                  </TableCell>
                );
                // }
                // return null;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CashTable;
