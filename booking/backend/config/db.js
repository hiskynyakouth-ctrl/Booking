const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.db;
    if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
      console.warn("⚠️  Invalid or missing MongoDB URI in .env — running without database");
      return;
    }
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn("⚠️  MongoDB not available:", err.message);
    console.warn("   Server continues running — auth will use fallback mode");
  }
};

module.exports = connectDB;
