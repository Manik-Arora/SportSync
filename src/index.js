import express from "express";

const app = express();

const PORT = Number(process.env.PORT || 8000);

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server running on at http://localhost:${PORT}`);
});
