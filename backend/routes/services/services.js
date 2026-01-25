import express from "express";
import { saveCashFlowData } from "../../services/saveCashFlow.js";

const router = express.Router();

router.post("/save-cash-flow", async (req, res) => {
  try {
    const data = req.body;
    const savedData = await saveCashFlowData(data);
    res.status(200).json({ message: "Cash Flow Data Saved", data: savedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
