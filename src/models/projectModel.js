const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre du projet est obligatoire"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "La description du projet est obligatoire"],
      trim: true
    },
    technologies: {
      type: [String],
      default: []
    },
    githubUrl: {
      type: String,
      trim: true
    },
    demoUrl: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["planifie", "en cours", "termine"],
      default: "planifie"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);
