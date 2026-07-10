import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);

async function create() {
  try {
    await createUserWithEmailAndPassword(auth, 'admin@example.com', 'admin123');
    console.log('User created: admin@example.com / admin123');
  } catch (e) {
    console.log(e);
  }
  process.exit();
}
create();
