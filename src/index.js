import express from "express";
import matchRouter from "./routes/matches.js";

const app = express();
const PORT = Number(process.env.PORT || 8000);

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/matches", matchRouter);

app.listen(PORT, () => {
  console.log(`Server running on at http://localhost:${PORT}`);
});
