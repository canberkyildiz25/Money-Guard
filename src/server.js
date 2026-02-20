import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectDB } from './utils/db.js';

const PORT = process.env.PORT || 4000;

try {
  await connectDB();
} catch (error) {
  if (process.env.NODE_ENV !== 'development') {
    throw error;
  }
  console.warn('MongoDB unavailable in development mode. API started without database connection.');
}

http.createServer(app).listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});