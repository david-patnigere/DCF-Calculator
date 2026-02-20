import {
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";

const DataPresentation = ({
  cashFlowData,
  amountUnits,
  formatCurrency,
  terminalGrowthRate,
  discountRate,
  financialDataResults,
}) => {
  const terminalValue =
    (cashFlowData[cashFlowData.length - 1].freeCashFlow *
      (1 + terminalGrowthRate / 100)) /
    (discountRate / 100 - terminalGrowthRate / 100);

  const pvTerminalValue =
    terminalValue / Math.pow(1 + discountRate / 100, cashFlowData.length);
  // console.log("Terminal Value: ", terminalValue);

  const sumOfPVs =
    cashFlowData.reduce((sum, item) => sum + item.presentValue, 0) +
    pvTerminalValue;

  const intrinsicValue =
    (sumOfPVs - financialDataResults[0]?.netDebt) /
    financialDataResults[0]?.sharesOutstanding;

  return (
    <div className="data-presentation">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Year Number</TableCell>
              <TableCell align="center">Free Cash Flow</TableCell>
              <TableCell align="center">Present Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cashFlowData.map((result: any, index: number) => (
              <TableRow key={index}>
                {Object.keys(result).map((key: string) => {
                  if (key !== "currency") {
                    return (
                      <TableCell key={key} align="center">
                        {key !== "reportYear"
                          ? formatCurrency(result[key], result.currency)
                          : result[key]}
                      </TableCell>
                    );
                  }
                  // }
                  // return null;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Field</TableCell>
                <TableCell align="center">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">Sum of PVs</TableCell>
                <TableCell align="center">
                  {formatCurrency(
                    cashFlowData.reduce(
                      (sum, item) => sum + item.presentValue,
                      0
                    ),
                    cashFlowData[0]?.currency
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Terminal Value (PV)</TableCell>
                <TableCell align="center">
                  {formatCurrency(pvTerminalValue, cashFlowData[0]?.currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Sum of PVs</TableCell>
                <TableCell align="center">
                  {formatCurrency(sumOfPVs, cashFlowData[0]?.currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Net Debt</TableCell>
                <TableCell align="center">
                  {formatCurrency(
                    financialDataResults[0]?.netDebt,
                    cashFlowData[0]?.currency
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Intrinsic Value</TableCell>
                <TableCell align="center">
                  {formatCurrency(
                    sumOfPVs - financialDataResults[0]?.netDebt,
                    cashFlowData[0]?.currency
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Shares Outstanding</TableCell>
                <TableCell align="center">
                  {financialDataResults[0]?.sharesOutstanding}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Share Price</TableCell>
                <TableCell align="center">
                  {financialDataResults[0]?.sharesOutstanding
                    ? formatCurrency(intrinsicValue, cashFlowData[0]?.currency)
                    : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Value Band</TableCell>
                <TableCell align="center">
                  {financialDataResults[0]?.sharesOutstanding
                    ? formatCurrency(
                        intrinsicValue * 0.85,
                        cashFlowData[0]?.currency
                      ) +
                      " to " +
                      formatCurrency(
                        intrinsicValue * 1.15,
                        cashFlowData[0]?.currency
                      )
                    : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default DataPresentation;
