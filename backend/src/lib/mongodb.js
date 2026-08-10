import mongoose from 'mongoose';
import { logger } from './logger.js';

let connected = false;

export async function connectMongo() {
  if (connected) return;
  const uri = process.env.MONGODB_URL;
  if (!uri) throw new Error('MONGODB_URL environment variable is not set');
  await mongoose.connect(uri);
  connected = true;
  logger.info('MongoDB connected');
}

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    company: { type: String, default: null },
    service: { type: String, default: null },
    technicalScope: { type: String, default: null },
    message: { type: String, required: true },
    fileName: { type: String, default: null },
    filePath: { type: String, default: null },
    fileData: { type: Buffer, default: null },
    status: { type: String, enum: ['new', 'replied', 'closed'], default: 'new' },
    notes: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Contact =
  mongoose.models['Contact'] ?? mongoose.model('Contact', contactSchema);
