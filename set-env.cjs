const cp = require('child_process');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const vars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'JWT_SECRET', 'ADMIN_PASSWORD'];

for (const v of vars) {
  const match = env.match(new RegExp(v + '=\\"?(.*?)\\"?$', 'm'));
  if (match) {
    let val = match[1];
    if (v === 'FIREBASE_PRIVATE_KEY') val = val.replace(/\\n/g, '\n');
    console.log('Setting ' + v);
    try {
      cp.execSync('npx vercel env rm ' + v + ' production --yes', { stdio: 'ignore' });
    } catch(e) {}
    try {
      cp.execSync('npx vercel env add ' + v + ' production', { input: val, stdio: ['pipe', 'inherit', 'inherit'] });
    } catch(e) {
      console.error('Failed to set ' + v);
    }
  }
}
