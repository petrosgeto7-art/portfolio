const fs = require('fs');

// Projects.tsx
let pCode = fs.readFileSync('src/components/sections/Projects.tsx', 'utf8');
pCode = pCode.replace(/import \{ collection, getDocs, query, orderBy \} from 'firebase\/firestore';/, "import { apiFetch } from '../../lib/api';");
pCode = pCode.replace(/import \{ db \} from '\.\.\/\.\.\/lib\/firebase';/, "");
pCode = pCode.replace(
  /const fetchProjects = async \(\) => \{[\s\S]*?setLoading\(false\);\s*\};/,
  `const fetchProjects = async () => {
    try {
      const data = await apiFetch('/projects');
      setProjects(data.filter((p: any) => p.featured)); // Assuming we only show featured projects or all, let's keep all for now if no featured logic was there
      // Wait, let's just use what they had. Let's just setProjects(data)
      setProjects(data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };`
);
fs.writeFileSync('src/components/sections/Projects.tsx', pCode);

// Contact.tsx
let cCode = fs.readFileSync('src/components/sections/Contact.tsx', 'utf8');
cCode = cCode.replace(/import \{ collection, addDoc \} from 'firebase\/firestore';/, "import { apiFetch } from '../../lib/api';");
cCode = cCode.replace(/import \{ db \} from '\.\.\/\.\.\/lib\/firebase';/, "");
cCode = cCode.replace(
  /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?setSubmitting\(false\);\s*\}\s*\};/,
  `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    try {
      await apiFetch('/messages', { method: 'POST', body: JSON.stringify(formData) });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };`
);
fs.writeFileSync('src/components/sections/Contact.tsx', cCode);

