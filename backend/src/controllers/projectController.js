import Project from '../models/Project.js';

/**
 * Controller contenant la logique métier pour la gestion des projets
 */

/**
 * @desc    Créer un nouveau projet
 * @route   POST /api/projects
 * @access  Public (à sécuriser en production)
 */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès',
      data: project
    });
  } catch (error) {
    // Gestion des erreurs de validation
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: error.message
    });
  }
};

/**
 * @desc    Récupérer tous les projets
 * @route   GET /api/projects
 * @access  Public
 */
export const getAllProjects = async (req, res) => {
  try {
    // Filtres optionnels via query params
    const { category, featured, status } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (status) filter.status = status;
    
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 }) // Tri par date de création décroissante
      .select('-__v'); // Exclure le champ __v
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets',
      error: error.message
    });
  }
};

/**
 * @desc    Récupérer un projet par son ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select('-__v');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    // Gestion des erreurs d'ID invalide
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé - ID invalide'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet',
      error: error.message
    });
  }
};

/**
 * @desc    Modifier un projet
 * @route   PUT /api/projects/:id
 * @access  Public (à sécuriser en production)
 */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Retourner le document modifié
        runValidators: true // Exécuter les validateurs du schéma
      }
    ).select('-__v');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Projet modifié avec succès',
      data: project
    });
  } catch (error) {
    // Gestion des erreurs de validation
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }
    
    // Gestion des erreurs d'ID invalide
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé - ID invalide'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du projet',
      error: error.message
    });
  }
};

/**
 * @desc    Supprimer un projet
 * @route   DELETE /api/projects/:id
 * @access  Public (à sécuriser en production)
 */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Projet supprimé avec succès',
      data: {}
    });
  } catch (error) {
    // Gestion des erreurs d'ID invalide
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé - ID invalide'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du projet',
      error: error.message
    });
  }
};
