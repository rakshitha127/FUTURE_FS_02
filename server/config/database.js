import mongoose from 'mongoose';

export function useFileDb() {
  return process.env.DB_MODE === 'file';
}

export function getMongoUri() {
  const rawUri = process.env.MONGO_URI;

  if (!rawUri) {
    throw new Error('MONGO_URI is missing. Add it to your .env file.');
  }

  const mongoUri = rawUri.trim().replace(/^['"]|['"]$/g, '');

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    throw new Error('MONGO_URI must start with mongodb:// or mongodb+srv://. Check your .env file for extra spaces, quotes, or missing characters.');
  }

  return mongoUri;
}

export async function connectDatabase() {
  if (useFileDb()) {
    console.log('Using local file database mode.');
    return;
  }

  await mongoose.connect(getMongoUri());
}
