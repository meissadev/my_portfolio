const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion a MongoDB reussie");
  } catch (error) {
    console.error("Erreur de connexion a MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
