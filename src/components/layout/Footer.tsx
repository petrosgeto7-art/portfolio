import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

export default function Footer() {
  const { content } = useContent();

  const socials = [
    { icon: Github, label: 'GH', href: '#' },
    { icon: Linkedin, label: 'LI', href: '#' },
    { icon: Twitter, label: 'TW', href: '#' },
  ];

  return (
    <footer className="w-full py-12 px-6 relative overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/[0.05]">
              <img src="/pg_logo_gold.png" alt="PG" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              © {new Date().getFullYear()} {content.brand?.firstName || 'Petros'} {content.brand?.lastName || 'Geto'}. All rights reserved.
            </p>
          </div>

          {/* Social links & Back to top */}
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:scale-110 shadow-lg shadow-black/20"
              >
                <social.icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
