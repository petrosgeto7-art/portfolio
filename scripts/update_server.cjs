const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /if \(process.env.NODE_ENV !== 'test'\) \{\s*startServer\(\);\s*\}/,
  `if (!process.env.VERCEL) {
  startServer();
}`
);

fs.writeFileSync('server.ts', code);
