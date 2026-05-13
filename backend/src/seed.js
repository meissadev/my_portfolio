import dotenv from 'dotenv';
import connectDB from './config/connectdb.js';
import Project from './models/Project.js';

// Charger les variables d'environnement
dotenv.config();

// Données de test
const sampleProjects = [
  {
    title: "Étude comparative de firewall Next-Gen",
    description: "Analyse approfondie et comparaison des solutions Fortigate et Sophos pour la sécurisation des infrastructures réseau. Évaluation des performances, fonctionnalités et coûts.",
    technologies: ["Fortigate", "Sophos", "Sécurité réseau", "Firewall"],
    category: "autre",
    featured: true,
    status: "terminé",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-03-20')
  },
  {
    title: "Virtualisation et Stockage",
    description: "Déploiement d'une infrastructure virtualisée avec VMware ESXi et TrueNAS. Automatisation du provisionnement avec Terraform pour une gestion efficace des ressources.",
    technologies: ["VMware ESXi", "TrueNAS", "Terraform", "Infrastructure as Code"],
    category: "autre",
    featured: true,
    status: "terminé",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-04-15')
  },
  {
    title: "Haute Disponibilité (LAN)",
    description: "Configuration de la redondance avec STP, EtherChannel et HSRP sur équipements Cisco pour garantir la continuité de service. Mise en place de protocoles de basculement automatique.",
    technologies: ["Cisco", "STP", "EtherChannel", "HSRP", "Réseau"],
    category: "autre",
    featured: true,
    status: "terminé",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-05-01')
  },
  {
    title: "Pipeline CI/CD",
    description: "Mise en place de pipelines d'intégration et de déploiement continus sur GitLab et Jenkins pour automatiser les workflows de développement. Configuration de tests automatisés et déploiements.",
    technologies: ["GitLab CI/CD", "Jenkins", "DevOps", "Docker", "Kubernetes"],
    category: "web",
    featured: true,
    status: "terminé",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-05-08')
  },
  {
    title: "Portfolio Full Stack",
    description: "Développement d'un portfolio professionnel avec React, Express et MongoDB. API REST complète avec gestion CRUD des projets. Interface moderne et responsive.",
    technologies: ["React", "Express", "MongoDB", "Node.js", "TailwindCSS"],
    category: "web",
    featured: true,
    status: "en cours",
    imageUrl: "",
    githubUrl: "https://github.com/username/portfolio",
    liveUrl: "https://portfolio.example.com",
    startDate: new Date('2026-05-01')
  }
];

/**
 * Fonction pour insérer les données de test
 */
const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Supprimer toutes les données existantes
    console.log('🗑️  Suppression des données existantes...');
    await Project.deleteMany({});

    // Insérer les nouvelles données
    console.log('📝 Insertion des données de test...');
    const projects = await Project.insertMany(sampleProjects);

    console.log(`✅ ${projects.length} projets insérés avec succès !`);
    console.log('\nProjets créés :');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// Exécuter le seed
seedDatabase();
