import express from "express";
import cors from "cors";
import tickerRouter from "./routes/ticker.js";

const app = express();

// https://api.bseindia.com/BseIndiaAPI/api/AnnGetData/w
// ?strCat=AN&strPrevDate=&strScrip=500112

app.use(cors());
app.use(express.json());

app.use("/api", tickerRouter);

app.listen(8000, (error) => {
  if (!error) console.log("Server is running on port 8000");
  else console.log("Error occurred, server can't start", error);
});
