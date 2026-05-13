import mongoose from 'mongoose';

/**
 * Modèle de données pour les projets du portfolio
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre du projet est requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
      type: String,
      required: [true, 'La description du projet est requise'],
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    technologies: {
      type: [String],
      required: [true, 'Au moins une technologie est requise'],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Le projet doit avoir au moins une technologie'
      }
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    githubUrl: {
      type: String,
      trim: true,
      default: ''
    },
    liveUrl: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'autre'],
      default: 'web'
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['en cours', 'terminé', 'archivé'],
      default: 'terminé'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    }
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index pour améliorer les performances de recherche
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1, featured: -1 });

// Méthode virtuelle pour calculer la durée du projet
projectSchema.virtual('duration').get(function() {
  if (this.endDate) {
    const duration = this.endDate - this.startDate;
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    return `${days} jours`;
  }
  return 'En cours';
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
