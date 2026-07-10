const fs = require('fs');
let ct = fs.readFileSync('src/components/sections/Contact.tsx', 'utf8');
ct = ct.replace(/await addDoc\([\s\S]*?\);/g, `await apiFetch('/messages', { method: 'POST', body: JSON.stringify(formData) });`);
fs.writeFileSync('src/components/sections/Contact.tsx', ct);
