import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
