import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

const PORT = process.env.PORT || 5000;

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
});