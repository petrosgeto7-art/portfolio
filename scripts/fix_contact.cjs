const fs = require('fs');
let c = fs.readFileSync('src/components/sections/Contact.tsx', 'utf8');
c = c.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?setSubmitting\(false\);\s*\}\s*\};/g, 
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
  };`);
fs.writeFileSync('src/components/sections/Contact.tsx', c);
