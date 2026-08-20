// src/db/connectMongoDB.js
import mongoose from 'mongoose';
import { User } from '../models/user.js';
import { Canvas } from '../models/canvas.js';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');

    // Гарантуємо, що індекси в БД відповідають схемі
    await User.syncIndexes();
    await Canvas.syncIndexes();
    console.log('Indexes synced successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
};
