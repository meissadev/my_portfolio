/**
 * Service API pour communiquer avec le backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://portfolio-backend:5000/api';

/**
 * Fonction utilitaire pour gérer les requêtes HTTP
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

/**
 * API des projets
 */
export const projectsAPI = {
  /**
   * Récupérer tous les projets
   * @param {Object} filters - Filtres optionnels (category, featured, status)
   * @returns {Promise<Object>} Liste des projets
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/projects?${queryParams}` : '/projects';
    return fetchAPI(endpoint);
  },

  /**
   * Récupérer un projet par son ID
   * @param {string} id - ID du projet
   * @returns {Promise<Object>} Détails du projet
   */
  getById: async (id) => {
    return fetchAPI(`/projects/${id}`);
  },

  /**
   * Créer un nouveau projet
   * @param {Object} projectData - Données du projet
   * @returns {Promise<Object>} Projet créé
   */
  create: async (projectData) => {
    return fetchAPI('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Modifier un projet existant
   * @param {string} id - ID du projet
   * @param {Object} projectData - Nouvelles données du projet
   * @returns {Promise<Object>} Projet modifié
   */
  update: async (id, projectData) => {
    return fetchAPI(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Supprimer un projet
   * @param {string} id - ID du projet
   * @returns {Promise<Object>} Confirmation de suppression
   */
  delete: async (id) => {
    return fetchAPI(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Vérifier la santé de l'API
 */
export const healthCheck = async () => {
  return fetchAPI('/health');
};

export default projectsAPI;
