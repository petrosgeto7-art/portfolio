import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const links = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = links.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl bg-black/70 backdrop-blur-2xl shadow-2xl shadow-black/50 border border-white/[0.08] py-3 rounded-full flex justify-center"
      >
        <div className="w-full max-w-7xl px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden relative bg-black">
              <img src="/pg_logo_gold.png" alt="PG" className="w-full h-full object-cover" />
            </div>
            <span className="text-base font-display font-bold tracking-tight text-white hidden sm:block">
              {content.brand?.firstName || 'PETROS'}<span className="text-amber-400">.</span>
            </span>
          </a>
        </div>

        {/* Desktop Links (Centered) */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-2">
          {links.filter(l => l.name !== 'Contact').map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${activeSection === link.href.replace('#', '')
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {activeSection === link.href.replace('#', '') && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/[0.08] rounded-lg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Right CTA & Mobile Menu */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <a
            href="#contact"
            className="hidden lg:flex items-center justify-center px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105"
          >
            Contact Me
          </a>
          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60"
            />
            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[65%] max-w-[280px] bg-[#050505] border-l border-white/10 flex flex-col pt-20 px-5 shadow-2xl"
            >
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                className="absolute top-5 right-5 text-gray-400 p-2 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </motion.button>

              <div className="flex flex-col gap-3 w-full mt-4">
                {links.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    className={`w-full flex items-center px-4 py-3 text-base rounded-xl font-display font-medium transition-all duration-300 ${
                      link.name === 'Contact' 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold mt-4 shadow-lg shadow-amber-500/20 text-center justify-center'
                        : activeSection === link.href.replace('#', '')
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
