import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Using existing Mongoose connection.");
      return mongoose;
    }

    const db = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ Connected to MongoDB: ${db.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
  }
  return mongoose;
};

export default connectMongoDB;
