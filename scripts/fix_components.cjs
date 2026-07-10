const fs = require('fs');

let settings = fs.readFileSync('src/components/admin/SettingsForm.tsx', 'utf8');
settings = settings.replace(/const handleProfileImageUpload = async \([\s\S]*?\}\s*\};/g, `const handleProfileImageUpload = async (e: any) => { alert('Image uploads via file are disabled. Please paste an image URL instead.'); };`);
settings = settings.replace(/const handleCertImageUpload = async \([\s\S]*?\}\s*\};/g, `const handleCertImageUpload = async (e: any, index: number) => { alert('Image uploads via file are disabled. Please paste an image URL instead.'); };`);
settings = settings.replace(/uploadingProfileImg/g, 'false');
settings = settings.replace(/uploadingCertImg/g, '(-1)');
settings = settings.replace(/<Upload size=\{16\} \/>/g, 'Upload');
fs.writeFileSync('src/components/admin/SettingsForm.tsx', settings);

let pm = fs.readFileSync('src/components/admin/ProjectsManager.tsx', 'utf8');
pm = pm.replace(/const handleSave = async \(id: string\) => \{[\s\S]*?fetchProjects\(\);\s*\};/g, 
`const handleSave = async (id: string) => {
    if (!id) return;
    try {
      await apiFetch(\`/projects/\${id}\`, { method: 'PUT', body: JSON.stringify(formData) });
      setEditingId(null);
      fetchProjects();
    } catch (e) { console.error('Failed to update project', e); }
  };`);
pm = pm.replace(/const handleDelete = async \(id: string\) => \{[\s\S]*?fetchProjects\(\);\s*\};/g, 
`const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await apiFetch(\`/projects/\${id}\`, { method: 'DELETE' });
        fetchProjects();
      } catch (e) { console.error('Failed to delete project', e); }
    }
  };`);
pm = pm.replace(/const handleAdd = async \(\) => \{[\s\S]*?fetchProjects\(\);\s*\};/g, 
`const handleAdd = async () => {
    const newProject = { title: 'New Project', slug: 'new-project', description: 'Description', content: 'Content', thumbnail: '', technologies: ['React'], featured: false, order: 0, createdAt: Date.now() };
    try { await apiFetch('/projects', { method: 'POST', body: JSON.stringify(newProject) }); fetchProjects(); } catch (e) { console.error('Failed to add project', e); }
  };`);
pm = pm.replace(/const handleImageUpload = async \([\s\S]*?\}\s*\};/g, `const handleImageUpload = async (e: any) => { alert('Direct file upload is disabled. Please paste an image URL instead.'); };`);
pm = pm.replace(/uploadingImage/g, 'false');
fs.writeFileSync('src/components/admin/ProjectsManager.tsx', pm);

let server = fs.readFileSync('server.ts', 'utf8');
// Fix mongoose findByIdAndUpdate vs findOneAndUpdate
server = server.replace(/Settings\.findByIdAndUpdate\('content'/g, `Settings.findOneAndUpdate({ _id: 'content' }`);
server = server.replace(/app\.listen\(PORT, '0\.0\.0\.0' as any,/g, `app.listen(Number(PORT), '0.0.0.0',`);
server = server.replace(/await Project\.findByIdAndUpdate\(req\.params\.id/g, `await Project.findOneAndUpdate({ _id: req.params.id }`);
server = server.replace(/await Project\.findByIdAndDelete\(req\.params\.id/g, `await Project.findOneAndDelete({ _id: req.params.id }`);
server = server.replace(/await Message\.findByIdAndDelete\(req\.params\.id/g, `await Message.findOneAndDelete({ _id: req.params.id }`);
server = server.replace(/await Settings\.findById\('content'\)/g, `await Settings.findOne({ _id: 'content' })`);
fs.writeFileSync('server.ts', server);

