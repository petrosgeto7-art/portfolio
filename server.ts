// @ts-nocheck
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

// --- Firebase Admin Initialization ---
if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase initialized using base64 service account.');
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64', e);
    }
  } else {
    // Fallback to legacy environment variables or default
    const projectId = process.env.FIREBASE_PROJECT_ID || 'portfolio-6c8bc';
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (clientEmail && privateKey) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } else {
      initializeApp({ projectId });
    }
  }
}

const db = getFirestore();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

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

// --- Projects ---
api.get('/projects', async (req, res) => {
  try {
    const snapshot = await db.collection('projects').orderBy('order', 'asc').get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.json([]);
  }
});

api.post('/projects', requireAuth, async (req, res) => {
  try {
    const data = { ...req.body, createdAt: Date.now() };
    const docRef = await db.collection('projects').add(data);
    res.json({ id: docRef.id, ...data });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

api.put('/projects/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('projects').doc(req.params.id).update(req.body);
    const doc = await db.collection('projects').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

api.delete('/projects/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('projects').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// --- Messages ---
api.get('/messages', requireAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.json([]);
  }
});

api.post('/messages', async (req, res) => {
  try {
    const data = { ...req.body, read: false, createdAt: Date.now() };
    const docRef = await db.collection('messages').add(data);
    res.json({ id: docRef.id, ...data });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

api.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    await db.collection('messages').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// --- Settings ---
api.get('/settings', async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('content').get();
    res.json(doc.exists ? doc.data() : {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.json({});
  }
});

api.post('/settings', requireAuth, async (req, res) => {
  try {
    await db.collection('settings').doc('content').set(req.body, { merge: true });
    const doc = await db.collection('settings').doc('content').get();
    res.json(doc.data());
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// --- Stats ---
api.get('/stats', requireAuth, async (req, res) => {
  try {
    const [projectsSnap, messagesSnap] = await Promise.all([
      db.collection('projects').count().get(),
      db.collection('messages').count().get(),
    ]);
    res.json({
      projects: projectsSnap.data().count,
      messages: messagesSnap.data().count,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.json({ projects: 0, messages: 0 });
  }
});

app.use('/api', api);

// Serve Vite / static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import: vite is only loaded in dev, never on Vercel
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
