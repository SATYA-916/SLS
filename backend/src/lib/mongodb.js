import mongoose from 'mongoose';

const connection = {};

export async function connectMongo() {
  if (connection.isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

// ── Contact Schema ──
const noteSchema = new mongoose.Schema(
  { text: String },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    company: String,
    service: String,
    message: String,
    fileData: Buffer,
    fileName: String,
    filePath: String,
    status: { type: String, default: 'new' },
    notes: [noteSchema],
  },
  { timestamps: true }
);

export const Contact =
  mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// ── Service Schema ──
const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'gear' },
  },
  { timestamps: true }
);
export const Service =
  mongoose.models.Service || mongoose.model('Service', serviceSchema);

// ── Project Schema ──
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Structures' },
    client: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    image: { type: String, default: '' },
    challenge: { type: String, default: '' },
    solution: { type: String, default: '' },
    slsAction: { type: String, default: '' },
    equipment: { type: String, default: '' },
    consultation: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model('Project', projectSchema);
