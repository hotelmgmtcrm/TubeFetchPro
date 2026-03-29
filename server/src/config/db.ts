import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (mongoUri && !process.env.USE_MOCK_DB) {
      console.log(`Connecting to MongoDB Atlas...`);
      // Add a timeout for connection to avoid hanging
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[SUCCESS] Connected to MongoDB Atlas`);
    } else {
      throw new Error('Atlas URI missing or USE_MOCK_DB enabled');
    }
  } catch (error: any) {
    console.warn(`[WARN] Atlas connection failed (${error.message}). Falling back to In-Memory DB...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`[SUCCESS] In-Memory MongoDB Started at ${uri}`);
    } catch (memError: any) {
      console.error(`[ERROR] All DB connections failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
