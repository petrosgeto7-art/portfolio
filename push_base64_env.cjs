const fs = require('fs');
const { execSync } = require('child_process');

const jsonPath = 'c:\\\\Users\\\\hp\\\\Downloads\\\\pportfolio-a820b-firebase-adminsdk-fbsvc-890724bf02.json';
const serviceAccount = fs.readFileSync(jsonPath, 'utf8');
const base64Encoded = Buffer.from(serviceAccount).toString('base64');

console.log('Adding FIREBASE_SERVICE_ACCOUNT_BASE64 to Vercel...');

try {
  execSync(`npx vercel env rm FIREBASE_SERVICE_ACCOUNT_BASE64 production --yes`, { stdio: 'ignore' });
} catch(e) {}

try {
  execSync(`npx vercel env add FIREBASE_SERVICE_ACCOUNT_BASE64 production --yes`, {
    input: base64Encoded,
    stdio: ['pipe', 'inherit', 'inherit']
  });
  console.log('Success!');
} catch (e) {
  console.error('Failed to add env var');
}
