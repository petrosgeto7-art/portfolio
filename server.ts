// @ts-nocheck
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import path from 'path';
// NOTE: vite is imported dynamically below — only in dev mode
// A static import here crashes the Vercel serverless function

dotenv.config();

mongoose.set('bufferCommands', false);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true })); // Vercel might need specific origin setup if not on same domain

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// --- Mongoose Models ---
const ProjectSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  content: String,
  thumbnail: String,
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  featured: Boolean,
  order: Number,
  createdAt: { type: Number, default: () => Date.now() }
});
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => Date.now() }
});
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

const SettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'content' },
  hero: Object,
  about: Object,
  contact: Object,
  certificates: Array,
  skills: Array
});
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

// --- Auth Middleware ---
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- API Routes ---
const api = express.Router();

api.post('/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

api.post('/auth/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

api.get('/auth/check', (req, res) => {
  const token = req.cookies.admin_token;
  if (!token) return res.json({ authenticated: false });
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

// Projects
api.get('/projects', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  const projects = await Project.find().sort({ order: 1 });
  // Map _id to id
  res.json(projects.map(p => {
    const obj = p.toObject();
    obj.id = obj._id;
    delete obj._id;
    return obj;
  }));
});
api.post('/projects', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });
  const p = new Project(req.body);
  await p.save();
  res.json(p);
});
api.put('/projects/:id', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });
  const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});
api.delete('/projects/:id', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Messages
api.get('/messages', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs.map(m => {
    const obj = m.toObject();
    obj.id = obj._id;
    delete obj._id;
    return obj;
  }));
});
api.post('/messages', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });
  const m = new Message(req.body);
  await m.save();
  res.json(m);
});
api.delete('/messages/:id', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Settings
api.get('/settings', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({});
  let s = await Settings.findById('content');
  res.json(s || {});
});
api.post('/settings', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });
  const s = await Settings.findByIdAndUpdate('content', req.body, { new: true, upsert: true });
  res.json(s);
});

api.get('/stats', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({ projects: 0, messages: 0 });
  const projectsCount = await Project.countDocuments();
  const messagesCount = await Message.countDocuments();
  res.json({ projects: projectsCount, messages: messagesCount });
});

// --- DB Connection (Serverless Support) ---
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  } else {
    console.warn('MONGODB_URI is not set. API will fail if it requires DB access.');
  }
};

app.use('/api', async (req, res, next) => {
  await connectDB();
  next();
}, api);

// Serve Vercel/Vite handling
async function startServer() {
  await connectDB();


  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import: vite is only loaded in dev, never on Vercel
    // Using a variable bypasses Vercel's @vercel/nft static analysis which crashes trying to bundle Vite
    const viteModule = 'vite';
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Dist serving for production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// For Vercel Serverless Function support, we also export the app
export default app;

if (!process.env.VERCEL) {
  startServer();
}
