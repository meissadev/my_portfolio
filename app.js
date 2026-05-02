const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./src/config/connectdb");
const projectRoutes = require("./src/routes/projectRoutes");
const portfolioInfo = require("./src/data/portfolioInfo");

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname)));

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API REST Portfolio operationnelle",
    owner: portfolioInfo,
    endpoints: {
      addProject: "POST /api/projects",
      getAllProjects: "GET /api/projects",
      getOneProject: "GET /api/projects/:id",
      updateProject: "PUT /api/projects/:id",
      deleteProject: "DELETE /api/projects/:id"
    }
  });
});

app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route introuvable"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur demarre sur le port ${PORT}`);
});
