const express = require("express");
const {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", addProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
