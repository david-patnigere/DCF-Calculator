import mongoose from "mongoose";

const CashFlowEntrySchema = new mongoose.Schema(
  {
    reportYear: {
      type: Number,
      required: true,
    },

    cashFromOperatingActivities: {
      type: Number,
      required: true,
    },

    capitalExpenditures: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    source: {
      type: String,
      default: "SEC-10K",
    },
  },
  { _id: false } // important: prevents auto _id for array items
);

const CompanyCashFlowSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      unique: true,
      index: true,
    },

    cashFlowData: {
      type: [CashFlowEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("CompanyCashFlow", CompanyCashFlowSchema);
