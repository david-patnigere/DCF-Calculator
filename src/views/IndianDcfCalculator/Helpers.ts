export const generateFutureCashFlows = (
  fcfResults: any[],
  growthRate: number,
  discountRate: number,
  currentYear: number
) => {
  if (!fcfResults || growthRate === null || discountRate === null) {
    throw new Error("Missing required data for cash flow generation");
  }

  const avgFcf =
    fcfResults.reduce(
      (sum: number, entry: any) => sum + entry.freeCashFlow,
      0
    ) / fcfResults.length;
  const projectionYears = 5;
  const generated = [];

  for (let i = 1; i <= projectionYears; i++) {
    const fcf = avgFcf * Math.pow(1 + growthRate / 100, i);
    const pv = fcf / Math.pow(1 + discountRate / 100, i);
    generated.push({
      reportYear: currentYear + i,
      freeCashFlow: fcf,
      presentValue: pv,
      currency: fcfResults[0]?.currency || "USD",
    });
  }
  return generated;
};
