import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

/**
 * Module de routes pour la gestion des projets
 */
const router = express.Router();

// Route: /api/projects
router.route('/')
  .get(getAllProjects)      // GET - Récupérer tous les projets
  .post(createProject);     // POST - Créer un nouveau projet

// Route: /api/projects/:id
router.route('/:id')
  .get(getProjectById)      // GET - Récupérer un projet par ID
  .put(updateProject)       // PUT - Modifier un projet
  .delete(deleteProject);   // DELETE - Supprimer un projet

export default router;
