const fs = require('fs');

// SettingsForm.tsx
let sf = fs.readFileSync('src/components/admin/SettingsForm.tsx', 'utf8');
sf = sf.replace(/setUploadingProfileImg\([^)]+\);/g, '');
sf = sf.replace(/setUploadingCertImg\([^)]+\);/g, '');
sf = sf.replace(/const url = await uploadImage\([^)]+\);/g, 'const url = "";');
fs.writeFileSync('src/components/admin/SettingsForm.tsx', sf);

// ProjectsManager.tsx
let pm = fs.readFileSync('src/components/admin/ProjectsManager.tsx', 'utf8');
pm = pm.replace(/const url = await uploadImage\([^)]+\);/g, 'const url = "";');
pm = pm.replace(/setUploadingImage\([^)]+\);/g, '');
fs.writeFileSync('src/components/admin/ProjectsManager.tsx', pm);

// Contact.tsx
let ct = fs.readFileSync('src/components/sections/Contact.tsx', 'utf8');
ct = ct.replace(/await addDoc\(collection\(db, 'messages'\), formData\);/g, `await apiFetch('/messages', { method: 'POST', body: JSON.stringify(formData) });`);
fs.writeFileSync('src/components/sections/Contact.tsx', ct);
