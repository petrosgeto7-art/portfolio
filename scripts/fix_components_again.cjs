const fs = require('fs');

// server.ts
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(/findOneAndUpdate\(\{ _id: req\.params\.id \}/g, `findByIdAndUpdate(req.params.id`);
server = server.replace(/findOneAndDelete\(\{ _id: req\.params\.id \}/g, `findByIdAndDelete(req.params.id`);
server = server.replace(/findOneAndUpdate\(\{ _id: 'content' \}/g, `findByIdAndUpdate('content'`);
server = server.replace(/findOne\(\{ _id: 'content' \}\)/g, `findById('content')`);
fs.writeFileSync('server.ts', server);

// ProjectsManager.tsx
let pm = fs.readFileSync('src/components/admin/ProjectsManager.tsx', 'utf8');
pm = pm.replace(/const handleSave = async \(id: string\) => \{[\s\S]*?fetchProjects\(\);\s*\}\s*catch \([^)]+\) \{\s*console\.error\([^)]+\);\s*\}\s*\};/, 
`const handleSave = async (id: string) => {
    if (!id) return;
    try {
      await apiFetch(\`/projects/\${id}\`, { method: 'PUT', body: JSON.stringify(formData) });
      setEditingId(null);
      fetchProjects();
    } catch (e) { console.error('Failed to update project', e); }
  };`);
pm = pm.replace(/const handleDelete = async \(id: string\) => \{[\s\S]*?fetchProjects\(\);\s*\}\s*\};/, 
`const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await apiFetch(\`/projects/\${id}\`, { method: 'DELETE' });
        fetchProjects();
      } catch (e) { console.error('Failed to delete project', e); }
    }
  };`);
pm = pm.replace(/const handleAdd = async \(\) => \{[\s\S]*?\}\s*catch \([^)]+\) \{\s*console\.error\([^)]+\);\s*\}\s*\};/, 
`const handleAdd = async () => {
    const newProject = { title: 'New Project', slug: 'new-project', description: 'Description', content: 'Content', thumbnail: '', technologies: ['React'], featured: false, order: 0, createdAt: Date.now() };
    try { await apiFetch('/projects', { method: 'POST', body: JSON.stringify(newProject) }); fetchProjects(); } catch (e) { console.error('Failed to add project', e); }
  };`);
pm = pm.replace(/const handleImageUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?alert\('Failed to upload image'\);\s*\}\s*\};/, `const handleImageUpload = async (e: any) => { alert('Direct file upload is disabled. Please paste an image URL instead.'); };`);
fs.writeFileSync('src/components/admin/ProjectsManager.tsx', pm);

// SettingsForm.tsx
let sf = fs.readFileSync('src/components/admin/SettingsForm.tsx', 'utf8');
sf = sf.replace(/const handleProfileImageUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?alert\('Failed to upload image'\);\s*\}\s*\};/, `const handleProfileImageUpload = async (e: any) => { alert('Image uploads via file are disabled. Please paste an image URL instead.'); };`);
sf = sf.replace(/const handleCertImageUpload = async \(e: React\.ChangeEvent<HTMLInputElement>, index: number\) => \{[\s\S]*?alert\('Failed to upload certificate image'\);\s*\}\s*\};/, `const handleCertImageUpload = async (e: any, index: number) => { alert('Image uploads via file are disabled. Please paste an image URL instead.'); };`);
fs.writeFileSync('src/components/admin/SettingsForm.tsx', sf);

// Contact.tsx
let ct = fs.readFileSync('src/components/sections/Contact.tsx', 'utf8');
ct = ct.replace(/await addDoc\(collection\(db, 'messages'\), formData\);/, `await apiFetch('/messages', { method: 'POST', body: JSON.stringify(formData) });`);
fs.writeFileSync('src/components/sections/Contact.tsx', ct);

