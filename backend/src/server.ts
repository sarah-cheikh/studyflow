import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StudyFlow backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.post("/api/study-plan", (req, res) => {
  const studyData = req.body;

  console.log("Received study data:", studyData);

  res.json({
    message: "Study data received successfully",
    data: studyData,
  });
});
