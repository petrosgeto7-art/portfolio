import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Phone, Github, Linkedin, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { apiFetch } from '../../lib/api';
import { useContent } from '../../contexts/ContentContext';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { content } = useContent();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: content.contact.email,
      href: `mailto:${content.contact.email}`,
      color: 'text-amber-400',
      hoverBg: 'group-hover:bg-amber-500/15',
      hoverBorder: 'group-hover:border-amber-500/30',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: content.contact.phone,
      href: `tel:${content.contact.phone.replace(/[^0-9+]/g, '')}`,
      color: 'text-yellow-400',
      hoverBg: 'group-hover:bg-yellow-500/15',
      hoverBorder: 'group-hover:border-yellow-500/30',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: content.contact.whatsapp,
      href: `https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, '')}`,
      color: 'text-emerald-400',
      hoverBg: 'group-hover:bg-emerald-500/15',
      hoverBorder: 'group-hover:border-emerald-500/30',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: content.contact.githubText,
      href: content.contact.githubUrl,
      color: 'text-slate-300',
      hoverBg: 'group-hover:bg-white/10',
      hoverBorder: 'group-hover:border-white/20',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: content.contact.linkedinText,
      href: content.contact.linkedinUrl,
      color: 'text-blue-400',
      hoverBg: 'group-hover:bg-blue-500/15',
      hoverBorder: 'group-hover:border-blue-500/30',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: content.contact.location,
      href: null,
      color: 'text-amber-400',
      hoverBg: 'group-hover:bg-amber-500/15',
      hoverBorder: 'group-hover:border-amber-500/30',
    },
  ];

  return (
    <section id="contact" className="w-full pt-32 pb-16 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* Left Column - Info */}
          <div>
            <p className="section-label">Contact</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
              <span className="text-gradient">Let's create something</span><br />
              <span className="text-gradient-primary">extraordinary.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-md leading-relaxed">
              Whether you have a project in mind, or simply want to chat about tech, I'm always open to new opportunities.
            </p>

            <div className="space-y-3">
              {contactItems.map((item, i) => {
                const Tag = item.href ? 'a' : 'div';
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Tag
                      {...(item.href ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex items-center gap-5 text-white group cursor-pointer p-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.03]"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06] ${item.hoverBg} ${item.hoverBorder} transition-all duration-300 group-hover:scale-110`}>
                        <item.icon size={20} className={item.color} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5 group-hover:text-slate-400 transition-colors">{item.label}</p>
                        <p className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{item.value}</p>
                      </div>
                    </Tag>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden h-fit"
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500/60 via-yellow-500/60 to-cyan-500/40" />

            {/* Corner glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm max-w-xs">Thanks for reaching out. I'll get back to you as soon as possible.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={16} className="text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-300">Send me a message</h3>
                </div>

                {/* Name input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-white/[0.03] border rounded-xl px-5 h-14 text-white text-sm focus:outline-none transition-all duration-300 placeholder:text-slate-600 ${focused === 'name'
                        ? 'border-[#d97706]/50'
                        : 'border-white/[0.06] hover:border-white/[0.12]'
                      }`}
                    placeholder="Your name"
                  />
                </div>

                {/* Email input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Email</label>
                  <input
                    required
                    name="email"
                    type="email"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-white/[0.03] border rounded-xl px-5 h-14 text-white text-sm focus:outline-none transition-all duration-300 placeholder:text-slate-600 ${focused === 'email'
                        ? 'border-[#d97706]/50'
                        : 'border-white/[0.06] hover:border-white/[0.12]'
                      }`}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Message input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Message</label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-white/[0.03] border rounded-xl px-5 py-4 text-white text-sm focus:outline-none transition-all duration-300 resize-none placeholder:text-slate-600 ${focused === 'message'
                        ? 'border-[#d97706]/50'
                        : 'border-white/[0.06] hover:border-white/[0.12]'
                      }`}
                    placeholder="Tell me about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-xl text-sm gap-2 font-medium mt-2 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>Send Message <Send size={16} /></>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
