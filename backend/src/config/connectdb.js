import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // ← attendre 10s avant timeout
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erreur MongoDB: ${err}`);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB déconnecté');
    });
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    if (retries > 0) {
      console.log(`🔄 Nouvelle tentative dans ${delay/1000}s... (${retries} restantes)`);
      await new Promise(res => setTimeout(res, delay));
      return connectDB(retries - 1, delay);
    }
    console.error('❌ MongoDB inaccessible après toutes les tentatives');
    process.exit(1);
  }
};

export default connectDB;
