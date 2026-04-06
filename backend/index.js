import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

// Prefer IPv4 for outbound connections (Render often has no usable IPv6 route to Gmail SMTP).
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

// Import routes
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — CORS (browser preflight must get Access-Control-Allow-Origin)
function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
]
  .filter(Boolean)
  .join(",")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // curl / Postman / same-machine: no Origin header
    if (!origin) {
      return callback(null, true);
    }
    const reqOrigin = normalizeOrigin(origin);
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(reqOrigin)) {
      return callback(null, true);
    }
    console.warn(`CORS: blocked origin "${reqOrigin}". Allowed: ${allowedOrigins.join(", ")}`);
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
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