import mongoose from "mongoose";
const cashFlowSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  cik: { type: String, required: true },
  reportYear: { type: Number, required: true },
  cfoValue: { type: Number, required: true },
  capexValue: { type: Number, required: true },
  currency: { type: String, required: true },
  unit: { type: String, required: true },
  fetchedAt: { type: Date, default: Date.now },
});

const CashFlow = mongoose.model("CashFlow", cashFlowSchema);
export default CashFlow;
