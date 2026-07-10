import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

import { Project } from '../../types';
import { Button } from '../ui/Button';
import { Plus, Trash2, Edit2, Save, X, Upload } from 'lucide-react';


export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/projects');
      setProjects(data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setFormData(p);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async (id: string) => {
    if (!id) return;
    try {
      await apiFetch(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(formData) });
      setEditingId(null);
      fetchProjects();
    } catch (e) { console.error('Failed to update project', e); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await apiFetch(`/projects/${id}`, { method: 'DELETE' });
        fetchProjects();
      } catch (e) { console.error('Failed to delete project', e); }
    }
  };

  const handleAdd = async () => {
    const newProject = { title: 'New Project', slug: 'new-project', description: 'Description', content: 'Content', thumbnail: '', technologies: ['React'], featured: false, order: 0, createdAt: Date.now() };
    try { await apiFetch('/projects', { method: 'POST', body: JSON.stringify(newProject) }); fetchProjects(); } catch (e) { console.error('Failed to add project', e); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      const url = "";
      setFormData({ ...formData, thumbnail: url });
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    }
    
  };

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Projects</h2>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus size={16} /> Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {editingId === p.id ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" 
                  placeholder="Title"
                />
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white resize-none" 
                  placeholder="Description"
                />
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Thumbnail Image URL</label>
                  <input 
                    type="text" 
                    value={formData.thumbnail || ''} 
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" 
                    placeholder="https://example.com/project-image.jpg"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-white/10">
                      <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <input 
                  type="text" 
                  value={(formData.technologies || []).join(', ')} 
                  onChange={e => setFormData({...formData, technologies: e.target.value.split(',').map(s => s.trim())})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" 
                  placeholder="Technologies (comma separated)"
                />
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={formData.githubUrl || ''} 
                    onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" 
                    placeholder="GitHub URL"
                  />
                  <input 
                    type="text" 
                    value={formData.liveUrl || ''} 
                    onChange={e => setFormData({...formData, liveUrl: e.target.value})}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white" 
                    placeholder="Live Demo URL"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(p.id)} size="sm" className="gap-2"><Save size={16} /> Save</Button>
                  <Button onClick={handleCancel} size="sm" variant="outline" className="gap-2"><X size={16} /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {p.thumbnail && (
                    <div className="w-20 h-14 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-gray-400 mb-2">{p.description}</p>
                    <div className="flex gap-2 text-xs text-primary mb-2">
                      {p.technologies?.join(' • ')}
                    </div>
                    <div className="text-xs text-gray-500 flex gap-4">
                      {p.githubUrl && <span>GitHub: {p.githubUrl}</span>}
                      {p.liveUrl && <span>Live: {p.liveUrl}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-white p-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && <p className="text-gray-500">No projects found. Add one to get started.</p>}
      </div>
    </div>
  );
}
