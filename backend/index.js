import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests and local development by default.
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// MongoDB connection
const dbName = process.env.MONGO_DB || "localhost2027";
const mongoUri = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`;

mongoose.connect(mongoUri)
.then(() => {
  console.log('MongoDB connected successfully ✅');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
    console.log('API endpoints ready for testing with Postman');
  });
})
.catch((err) => {
  console.error('MongoDB connection error ❌', err);
  process.exit(1);
});