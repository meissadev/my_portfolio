import mongoose from 'mongoose';

/**
 * Module de connexion à MongoDB
 * Établit la connexion à la base de données MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    
    // Gestion des événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erreur de connexion MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB déconnecté');
    });

    // Gestion de la fermeture propre
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connexion fermée suite à l\'arrêt de l\'application');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
