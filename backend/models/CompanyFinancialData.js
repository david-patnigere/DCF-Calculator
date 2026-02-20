import mongoose from "mongoose";

const FinancialDataSchema = new mongoose.Schema(
  {
    reportYear: {
      type: Number,
      required: true,
    },
    metaData: {
      unitMultiplier: {
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

    financeData: {
      totalAssets: {
        type: Number,
        required: true,
      },

      totalLiabilities: {
        type: Number,
        required: true,
      },

      totalEquity: {
        type: Number,
        required: true,
      },

      cashAndEquivalents: {
        type: Number,
        required: true,
      },

      shortTermDebt: {
        type: Number,
        required: true,
      },

      longTermDebt: {
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

      sharesOutstanding: {
        type: Number,
        default: 0,
      },
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
