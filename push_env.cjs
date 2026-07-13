const { execSync } = require('child_process');

const envs = {
  FIREBASE_PROJECT_ID: 'pportfolio-a820b',
  FIREBASE_CLIENT_EMAIL: 'firebase-adminsdk-fbsvc@pportfolio-a820b.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4KGA7AxVerVjl\n3iyUs1XpIvFQcoiIIXgMYZd47Az9cVKiM2JjBJX4y+pbwXw2qnmWETWb1vhswG1P\nXvZ6N+W5jxAweix61Y9X8LQmImKFVVm1fUz4yvmfOOSIg2gNEK9sVNqQR3W+zVQF\nGmhYCQ9fTbaz/msUeUa5lAb1Wlr0POGGFofM6/YoGm9iwJaq24cxpFGPicmzVHE3\nOTPeZpTAbVenKy6niCuWKXq8VNYfEzyZCKTIPwW3u3+sCmrJQiVSWPqNihHDOi7e\nIZMuKmxTkXoKzAYY2xgGaNX+LadiIbLEdPZnVzqc4AhQGSaopcNySHqgr8d2gYaw\nGeYgJFYpAgMBAAECggEANDN1u6SPHSxEA7yrpGcFVjWKc8RTgUsDbXcIacV3lSvX\nQZURMYIuRL0ArIu2+wPtvSUZrhgMiT8ufQ4tDc3kd2nfK+6lxxfcLxBS8HBUvvjH\nmhNviyJ2CbUlyrB9AR8Wqr2OytEGxlQLmfq3UyUWT2yG+pSGo+IQszALnObE23Ae\nxf2sRw/Q48h7WQem9AspAneTTSuumxuEKa1+Z/OKyDpDbksSfnT4obyZcNxkAB+V\nZiox6A9tU+ey/mydk411Ygc8kUylLJ7ciHZc6e9BSkc+V+hHVtkqwe2Tm3TVYc32\nWZNgZmGYegTSQyy+Ck99YX6JUUxWIvu3tbW9peFtRQKBgQDvwg07eiuymN9SYtmB\niK4zTcFom/OoFIF3gu3r/keddPYcJXWS74LSlok0Pm/A5u7UjQ/BfW0rVBvzWI/y\ni1sn0UDEO43uaGxnSHTiwvUHcgEeVMut5ude4rV/iy1xHUPIgBlAJqG/otrBPwm5\nmbDcIonZID1NlEnewNKUGQLBWwKBgQDEoha+gxBpbwxhwdXbcFagh1CXjb+5UZ/K\nfVskFNiGGucX4+b1iGAXRQkBK2vGdO8DfnrWOY/d5gqVIU8dxUgBd2J0BZjGOPjl\nifnze/oiiNZ6ghv4khPkbDHufSMew7Yg9E+rCe56eNoghc71PIV6lW8GC+ICY4IF\nCyLy5IN5ywKBgQCDgdHWPNW5GYbs3pFlLn42X8DlSx0jpVO6JNOxrQDFCgFwQM+z\nr7H3JmDNii2sBj8b0N/ChrSZnoHSQVJ7fBqcxXcb63qXOSm0oRaTxtG1qr+YTnSF\nx3BDKGDbO5DKSX4DfNfcyxPPVFlew9/msLlElaE8uiVF5z95chRO7UUInwKBgCD0\nqas0fEOvgPvBaP5mTZ6KD0/XShLdQ1LEv8nEVKXlTGYMpGDygmhkAaZYiK+yWXzU\nbfIJo7slGxDzjDcJIZBdWfroFTrjwZN3FJViagHvvUK7G8UFdqAKIjQ+dOxrENNl\nHxUjjPyp1KUuyAkCI7zv3rO8uhx8YQZHX4wmEIMRAoGBAK3mFcuBPEprXr1edgiY\nw54ZQHmVUua9NfY4KeCc5D8Go6zLpx3lxs9zn2nH7Fcx3bcjgK9w+73LxOgIrYaN\nF+9U11yu+9lGKwW3/uEz1bRProOjuVFLlE/VQGcfKL+HF+tE5zhmRDmNU3bGZz9Z\nb7+NTy3qEK1fuKd8mEl7jJeK\n-----END PRIVATE KEY-----\n`,
  ADMIN_PASSWORD: '321adnim',
  JWT_SECRET: 'secure-jwt-secret-for-portfolio-2026',
};

// First remove existing vars to ensure we have a clean slate, ignore errors
console.log('Removing old vars...');
try {
  execSync(`npx vercel env rm FIREBASE_PROJECT_ID production --yes`, { stdio: 'ignore' });
  execSync(`npx vercel env rm FIREBASE_CLIENT_EMAIL production --yes`, { stdio: 'ignore' });
  execSync(`npx vercel env rm FIREBASE_PRIVATE_KEY production --yes`, { stdio: 'ignore' });
  execSync(`npx vercel env rm ADMIN_PASSWORD production --yes`, { stdio: 'ignore' });
  execSync(`npx vercel env rm JWT_SECRET production --yes`, { stdio: 'ignore' });
} catch (e) {}

for (const [key, value] of Object.entries(envs)) {
  console.log(`Adding ${key} for production...`);
  try {
    execSync(`npx vercel env add ${key} production --yes`, {
      input: value,
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch (error) {
    console.error(`Failed to add ${key}`);
  }
}
