import mongoose from "mongoose";

const FinancialDataSchema = new mongoose.Schema(
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

    debtRatio: {
      type: Number,
      default: 0,
    },

    equityRatio: {
      type: Number,
      default: 0,
    },

    netDebt: {
      type: Number,
      default: 0,
    },

    sharesOutstanding: {
      type: Number,
      default: 0,
    },

    source: {
      type: String,
      default: "SEC-10K",
    },
  },
  { _id: false } // important: prevents auto _id for array items
);

const CompanyFinancialDataSchema = new mongoose.Schema(
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

    financialData: {
      type: [FinancialDataSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "CompanyFinancialData",
  CompanyFinancialDataSchema
);
