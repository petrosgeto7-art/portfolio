import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { useContent, PortfolioContent, CertificateContent, SkillGroup, SkillItem } from '../../contexts/ContentContext';
import { Button } from '../ui/Button';
import { Save, Plus, Trash2, Link, Upload, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function SettingsForm() {
  const { content } = useContent();
  const [formData, setFormData] = useState<PortfolioContent>(content);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleChange = (section: keyof PortfolioContent, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCertificateChange = (index: number, field: keyof CertificateContent, value: string) => {
    setFormData(prev => {
      const newCerts = [...prev.certificates];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certificates: newCerts };
    });
  };

  const addCertificate = () => {
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, { title: '', issuer: '', date: '', image: '' }]
    }));
  };

  const removeCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const handleSkillGroupChange = (index: number, field: keyof SkillGroup, value: string) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prev, skills: newSkills };
    });
  };

  const handleSkillItemChange = (groupIndex: number, itemIndex: number, field: keyof SkillItem, value: string) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      const newItems = [...newSkills[groupIndex].items];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
      newSkills[groupIndex] = { ...newSkills[groupIndex], items: newItems };
      return { ...prev, skills: newSkills };
    });
  };

  const addSkillItem = (groupIndex: number) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[groupIndex].items.push({ name: '', color: 'bg-white' });
      return { ...prev, skills: newSkills };
    });
  };

  const removeSkillItem = (groupIndex: number, itemIndex: number) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[groupIndex].items = newSkills[groupIndex].items.filter((_, i) => i !== itemIndex);
      return { ...prev, skills: newSkills };
    });
  };

  const addSkillGroup = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: 'New Domain', icon: '✨', items: [] }]
    }));
  };

  const removeSkillGroup = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== groupIndex)
    }));
  };

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingProfile(true);
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64Url = await imageCompression.getDataUrlFromFile(compressedFile);
      
      handleChange('hero', 'profileImage', base64Url);
    } catch (err) {
      console.error(err);
      alert('Failed to process image.');
    } finally {
      setUploadingProfile(false);
    }
  };

  const [uploadingAbout, setUploadingAbout] = useState(false);
  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingAbout(true);
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64Url = await imageCompression.getDataUrlFromFile(compressedFile);
      
      handleChange('about', 'aboutImage', base64Url);
    } catch (err) {
      console.error(err);
      alert('Failed to process image.');
    } finally {
      setUploadingAbout(false);
    }
  };

  const [uploadingCert, setUploadingCert] = useState<number | null>(null);
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingCert(index);
    try {
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64Url = await imageCompression.getDataUrlFromFile(compressedFile);
      
      handleCertificateChange(index, 'image', base64Url);
    } catch (err) {
      console.error(err);
      alert('Failed to process certificate image.');
    } finally {
      setUploadingCert(null);
    }
  };

  

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Global Content Settings</h2>
          <p className="text-gray-400">Update the text and images displayed on your portfolio.</p>
        </div>
        <div className="flex items-center gap-4">
          {message && <span className="text-primary text-sm">{message}</span>}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Brand Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-white">Brand Settings</h3>
          <p className="text-sm text-gray-400 -mt-4">This updates the name shown in the sidebar and navigation.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">First Name</label>
              <input 
                type="text" 
                value={formData.brand?.firstName || ''} 
                onChange={(e) => handleChange('brand', 'firstName', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="PETROS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Last Name</label>
              <input 
                type="text" 
                value={formData.brand?.lastName || ''} 
                onChange={(e) => handleChange('brand', 'lastName', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="GETO"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-white">Hero Section</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Headline Line 1</label>
              <input 
                type="text" 
                value={formData.hero.line1} 
                onChange={(e) => handleChange('hero', 'line1', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Headline Highlight</label>
              <input 
                type="text" 
                value={formData.hero.highlight} 
                onChange={(e) => handleChange('hero', 'highlight', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Headline Line 2</label>
              <input 
                type="text" 
                value={formData.hero.line2} 
                onChange={(e) => handleChange('hero', 'line2', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Years Experience (e.g. 03+)</label>
              <input 
                type="text" 
                value={formData.hero.yearsExperience} 
                onChange={(e) => handleChange('hero', 'yearsExperience', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Projects Shipped (e.g. 20+)</label>
              <input 
                type="text" 
                value={formData.hero.projectsShipped} 
                onChange={(e) => handleChange('hero', 'projectsShipped', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Profile Image URL or Upload</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.hero.profileImage} 
                  onChange={(e) => handleChange('hero', 'profileImage', e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  {uploadingProfile ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="text-sm">Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} disabled={uploadingProfile} />
                </label>
              </div>
              {formData.hero.profileImage && (
                <div className="mt-3 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                    <img src={formData.hero.profileImage} alt="Profile preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <span className="text-xs text-gray-500">Image preview</span>
                </div>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea 
                rows={3}
                value={formData.hero.description} 
                onChange={(e) => handleChange('hero', 'description', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-white">About Section</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Heading</label>
              <input 
                type="text" 
                value={formData.about.heading} 
                onChange={(e) => handleChange('about', 'heading', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Description Paragraph 1</label>
              <textarea 
                rows={3}
                value={formData.about.description1} 
                onChange={(e) => handleChange('about', 'description1', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Description Paragraph 2</label>
              <textarea 
                rows={3}
                value={formData.about.description2} 
                onChange={(e) => handleChange('about', 'description2', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">About Section Image URL or Upload</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.about.aboutImage || ''} 
                  onChange={(e) => handleChange('about', 'aboutImage', e.target.value)}
                  placeholder="https://example.com/about-image.jpg"
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  {uploadingAbout ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="text-sm">Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAboutImageUpload} disabled={uploadingAbout} />
                </label>
              </div>
              {formData.about.aboutImage && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-w-xs">
                  <img src={formData.about.aboutImage} alt="About preview" className="w-full h-auto object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-white">Contact Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email Address</label>
              <input 
                type="email" 
                value={formData.contact.email} 
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Phone Number</label>
              <input 
                type="text" 
                value={formData.contact.phone} 
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">WhatsApp Number</label>
              <input 
                type="text" 
                value={formData.contact.whatsapp} 
                onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Location</label>
              <input 
                type="text" 
                value={formData.contact.location} 
                onChange={(e) => handleChange('contact', 'location', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">GitHub Link</label>
              <input 
                type="text" 
                value={formData.contact.githubUrl} 
                onChange={(e) => handleChange('contact', 'githubUrl', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">GitHub Display Text</label>
              <input 
                type="text" 
                value={formData.contact.githubText} 
                onChange={(e) => handleChange('contact', 'githubText', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">LinkedIn Link</label>
              <input 
                type="text" 
                value={formData.contact.linkedinUrl} 
                onChange={(e) => handleChange('contact', 'linkedinUrl', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">LinkedIn Display Text</label>
              <input 
                type="text" 
                value={formData.contact.linkedinText} 
                onChange={(e) => handleChange('contact', 'linkedinText', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Certificates</h3>
            <Button onClick={addCertificate} size="sm" variant="outline" className="gap-2">
              <Plus size={16} /> Add Certificate
            </Button>
          </div>
          
          <div className="space-y-6">
            {formData.certificates.map((cert, index) => (
              <div key={index} className="p-6 border border-white/10 rounded-xl bg-black/30 relative">
                <button 
                  onClick={() => removeCertificate(index)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Title</label>
                    <input 
                      type="text" 
                      value={cert.title} 
                      onChange={(e) => handleCertificateChange(index, 'title', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Issuer</label>
                    <input 
                      type="text" 
                      value={cert.issuer} 
                      onChange={(e) => handleCertificateChange(index, 'issuer', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Date (e.g. 2024)</label>
                    <input 
                      type="text" 
                      value={cert.date} 
                      onChange={(e) => handleCertificateChange(index, 'date', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 block mb-1">Image URL or Upload</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={cert.image} 
                        onChange={(e) => handleCertificateChange(index, 'image', e.target.value)}
                        placeholder="https://example.com/cert-image.jpg"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      />
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        {uploadingCert === index ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <span className="text-sm">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleCertImageUpload(e, index)} disabled={uploadingCert === index} />
                      </label>
                    </div>
                    {cert.image && (
                      <div className="mt-2 w-20 h-14 rounded-lg overflow-hidden border border-white/10">
                        <img src={cert.image} alt="Cert preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {formData.certificates.length === 0 && (
              <p className="text-gray-500 text-center py-4">No certificates added.</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Skills Section</h3>
            <Button onClick={addSkillGroup} size="sm" variant="outline" className="gap-2">
              <Plus size={16} /> Add Domain
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Section Heading</label>
              <input 
                type="text" 
                value={formData.skillsSection?.heading || ''} 
                onChange={(e) => handleChange('skillsSection', 'heading', e.target.value)}
                placeholder="Technical Arsenal."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Section Description</label>
              <textarea 
                rows={3}
                value={formData.skillsSection?.description || ''} 
                onChange={(e) => handleChange('skillsSection', 'description', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>
          
          <div className="space-y-8 mt-8">
            {formData.skills.map((group, groupIndex) => (
              <div key={groupIndex} className="p-6 border border-white/10 rounded-xl bg-black/30 relative">
                <button 
                  onClick={() => removeSkillGroup(groupIndex)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                  title="Remove Domain"
                >
                  <Trash2 size={20} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                  <div>
                    <label className="text-sm text-gray-400">Category Name (Domain)</label>
                    <input 
                      type="text" 
                      value={group.category} 
                      onChange={(e) => handleSkillGroupChange(groupIndex, 'category', e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category Icon (Emoji or URL)</label>
                    <input 
                      type="text" 
                      value={group.icon || ''} 
                      onChange={(e) => handleSkillGroupChange(groupIndex, 'icon', e.target.value)}
                      placeholder="e.g. 🎨 or ⚙️"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors mt-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Skills in {group.category || 'this category'}</label>
                    <Button onClick={() => addSkillItem(groupIndex)} size="sm" variant="outline" className="h-8 text-xs py-0 gap-1">
                      <Plus size={12} /> Add Skill
                    </Button>
                  </div>
                  
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2 items-center flex-wrap md:flex-nowrap">
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={(e) => handleSkillItemChange(groupIndex, itemIndex, 'name', e.target.value)}
                        placeholder="Skill Name"
                        className="flex-1 min-w-[120px] bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      />
                      <input 
                        type="text" 
                        value={item.iconUrl || ''} 
                        onChange={(e) => handleSkillItemChange(groupIndex, itemIndex, 'iconUrl', e.target.value)}
                        placeholder="Custom Icon URL (optional)"
                        className="flex-1 min-w-[140px] bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      />
                      <input 
                        type="text" 
                        value={item.color} 
                        onChange={(e) => handleSkillItemChange(groupIndex, itemIndex, 'color', e.target.value)}
                        placeholder="Tailwind Color (e.g. bg-blue-500)"
                        className="flex-1 min-w-[120px] bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      />
                      <button 
                        onClick={() => removeSkillItem(groupIndex, itemIndex)}
                        className="text-gray-500 hover:text-red-400 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
