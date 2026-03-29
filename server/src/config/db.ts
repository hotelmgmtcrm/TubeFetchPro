import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tubefetchpro';
    
    console.log(`Connecting to MongoDB...`);
    const conn = await mongoose.connect(mongoUri);
    console.log(`\x1b[32m[SUCCESS] MongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error: any) {
    console.error(`\x1b[31m[ERROR] MongoDB Connection Failed: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

export default connectDB;
