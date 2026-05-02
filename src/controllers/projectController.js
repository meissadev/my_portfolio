const mongoose = require("mongoose");
const Project = require("../models/projectModel");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const addProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: "Projet ajoute avec succes",
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de projet invalide"
    });
  }

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable"
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de projet invalide"
    });
  }

  try {
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable"
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet modifie avec succes",
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Identifiant de projet invalide"
    });
  }

  try {
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Projet introuvable"
      });
    }

    res.status(200).json({
      success: true,
      message: "Projet supprime avec succes",
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
