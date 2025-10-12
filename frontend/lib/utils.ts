import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import mongoose from 'mongoose'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// MongoDB connection function
export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/menu';

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
