import mongoose from 'mongoose';

export const connectDB = async () => {
  const { MONGODB_URI, MONGODB_DB } = process.env;
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');

  // Log'larda kullanıcı/şifreyi maskele
  const uriSafe = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//<user>:<password>@');

  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB || 'money_guard' });
    console.log('MongoDB connected →', uriSafe);
  } catch (err) {
    console.error('Mongo connect error:', err.codeName || err.message);
    throw err;
  }
};
