const fs = require('fs');
let code = fs.readFileSync('src/components/admin/ProjectsManager.tsx', 'utf8');

code = code.replace(/import \{ collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy \} from 'firebase\/firestore';/, "import { apiFetch } from '../../lib/api';");
code = code.replace(/import \{ db \} from '\.\.\/\.\.\/lib\/firebase';/, "");
code = code.replace(/import \{ uploadImage \} from '\.\.\/\.\.\/lib\/storage';/, "");

// fetchProjects
code = code.replace(
  /const fetchProjects = async \(\) => \{[\s\S]*?setLoading\(false\);\s*\};/,
  `const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/projects');
      setProjects(data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };`
);

// handleSave
code = code.replace(
  /const handleSave = async \(id: string\) => \{[\s\S]*?fetchProjects\(\);\s*\};/,
  `const handleSave = async (id: string) => {
    if (!id) return;
    try {
      await apiFetch(\`/projects/\${id}\`, { method: 'PUT', body: JSON.stringify(formData) });
      setEditingId(null);
      fetchProjects();
    } catch (e) {
      console.error('Failed to update project', e);
    }
  };`
);

// handleDelete
code = code.replace(
  /const handleDelete = async \(id: string\) => \{[\s\S]*?fetchProjects\(\);\s*\};/,
  `const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await apiFetch(\`/projects/\${id}\`, { method: 'DELETE' });
        fetchProjects();
      } catch (e) {
        console.error('Failed to delete project', e);
      }
    }
  };`
);

// handleAdd
code = code.replace(
  /const handleAdd = async \(\) => \{[\s\S]*?fetchProjects\(\);\s*\};/,
  `const handleAdd = async () => {
    const newProject = {
      title: 'New Project',
      slug: 'new-project',
      description: 'Project Description',
      content: 'Detailed content goes here',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
      technologies: ['React', 'TypeScript'],
      featured: false,
      order: projects.length,
      createdAt: Date.now()
    };
    try {
      await apiFetch('/projects', { method: 'POST', body: JSON.stringify(newProject) });
      fetchProjects();
    } catch (e) {
      console.error('Failed to add project', e);
    }
  };`
);

// remove file upload logic
code = code.replace(
  /const handleImageUpload = async \(e: React.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?alert\('Failed to upload image'\);\s*\}\s*\};/,
  `const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    alert('Direct file upload is disabled. Please paste an image URL instead.');
  };`
);

fs.writeFileSync('src/components/admin/ProjectsManager.tsx', code);
