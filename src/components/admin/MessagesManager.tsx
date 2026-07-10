import React, { useEffect, useState } from 'react';
import { Trash2, User, Mail } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/messages');
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await apiFetch(`/messages/${id}`, { method: 'DELETE' });
        fetchMessages();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) return <div className="text-gray-400">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Messages</h2>
          <p className="text-gray-400">View and manage contact messages</p>
        </div>
        <span className="text-sm text-gray-400">{messages.length} total</span>
      </div>

      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                    <p className="text-xs text-gray-400">{msg.email}</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-3 pl-13">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-3">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-gray-400 hover:text-red-400 p-2 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-16">
            <Mail size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No messages yet</p>
            <p className="text-gray-600 text-sm">Messages from your contact form will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
