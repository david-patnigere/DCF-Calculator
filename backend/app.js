import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import tickerRouter from "./routes/ticker.js";
import secRouter from "./routes/usa/sec.js";
import servicesRouter from "./routes/services/services.js";

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/dcf-calculator")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
  });

// https://api.bseindia.com/BseIndiaAPI/api/AnnGetData/w
// ?strCat=AN&strPrevDate=&strScrip=500112

app.use(cors());
app.use(express.json());

app.use("/api", tickerRouter);

app.use("/api/usa", secRouter);

app.use("/api/services", servicesRouter);

app.listen(8000, (error) => {
  if (!error) console.log("Server is running on port 8000");
  else console.log("Error occurred, server can't start", error);
});
