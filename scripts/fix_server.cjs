const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /api\.get\('\/projects', async \(req, res\) => \{/,
  `api.get('/projects', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);`
);

code = code.replace(
  /api\.get\('\/messages', requireAuth, async \(req, res\) => \{/,
  `api.get('/messages', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);`
);

code = code.replace(
  /api\.get\('\/settings', async \(req, res\) => \{/,
  `api.get('/settings', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({});`
);

code = code.replace(
  /api\.get\('\/stats', requireAuth, async \(req, res\) => \{/,
  `api.get('/stats', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.json({ projects: 0, messages: 0 });`
);

code = code.replace(
  /api\.post\('\/projects', requireAuth, async \(req, res\) => \{/,
  `api.post('/projects', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });`
);

code = code.replace(
  /api\.put\('\/projects\/:id', requireAuth, async \(req, res\) => \{/,
  `api.put('/projects/:id', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });`
);

code = code.replace(
  /api\.delete\('\/projects\/:id', requireAuth, async \(req, res\) => \{/,
  `api.delete('/projects/:id', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });`
);

code = code.replace(
  /api\.post\('\/messages', async \(req, res\) => \{/,
  `api.post('/messages', async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });`
);

code = code.replace(
  /api\.delete\('\/messages\/:id', requireAuth, async \(req, res\) => \{/,
  `api.delete('/messages/:id', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });`
);

code = code.replace(
  /api\.post\('\/settings', requireAuth, async \(req, res\) => \{/,
  `api.post('/settings', requireAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) return res.status(500).json({ error: 'Not connected to DB' });`
);

// We need to disable buffering to prevent other hangs
code = code.replace(
  /const app = express\(\);/,
  `mongoose.set('bufferCommands', false);\nconst app = express();`
);

fs.writeFileSync('server.ts', code);
