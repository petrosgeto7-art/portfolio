import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, FolderKanban, MessageSquare, Plus, Activity, Settings, Trash2, Mail, Eye, User, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import SettingsForm from '../components/admin/SettingsForm';
import ProjectsManager from '../components/admin/ProjectsManager';
import MessagesManager from '../components/admin/MessagesManager';
import { useContent } from '../contexts/ContentContext';


export default function Admin() {
  const navigate = useNavigate();
  const { content } = useContent();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard stats
  const [stats, setStats] = useState({ projects: 0, messages: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await apiFetch('/auth/check');
        if (authenticated) {
          fetchStats();
        } else {
          navigate('/peto');
        }
      } catch (err) {
        navigate('/peto');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const data = await apiFetch('/stats');
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-white">Loading...</div>;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'content', label: 'Content', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative">
      <div className="fixed inset-0 bg-grid z-0 opacity-20 pointer-events-none" />
      
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/50 backdrop-blur-xl p-6 flex flex-col relative z-10">
        <div className="text-2xl font-display font-bold mb-12 tracking-tighter text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/[0.05]">
            <img src="/pg_logo.png" alt="PG" className="w-full h-full object-cover" style={{ filter: 'hue-rotate(135deg) saturate(1.5)' }} />
          </div>
          <span>{content.brand?.firstName || 'PETROS'} <span className="text-white">{content.brand?.lastName || 'GETO'}</span></span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary/20 text-primary font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={18} /> {item.label}
              {item.id === 'messages' && stats.messages > 0 && (
                <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{stats.messages}</span>
              )}
            </button>
          ))}
        </nav>
        
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <FolderKanban size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Total Projects</p>
                      <h3 className="text-3xl font-bold text-white">{stats.projects}</h3>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-between" onClick={() => setActiveTab('projects')}>
                    Manage <Activity size={14} />
                  </Button>
                </div>
                
                <div className="border border-white/10 bg-white/5 rounded-2xl p-6 backdrop-blur-sm cursor-pointer hover:border-blue-500/30 transition-colors" onClick={() => setActiveTab('messages')}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Messages</p>
                      <h3 className="text-3xl font-bold text-white">{stats.messages}</h3>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-between" onClick={() => setActiveTab('messages')}>
                    View All <Mail size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'projects' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">Manage Projects</h1>
              </div>
              <ProjectsManager />
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">Messages</h1>
              </div>
              <MessagesManager />
            </motion.div>
          )}
          
          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">Edit Portfolio Content</h1>
              </div>
              <SettingsForm />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
