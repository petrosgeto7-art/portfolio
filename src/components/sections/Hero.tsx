import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useContent } from '../../contexts/ContentContext';

const roles = ['AI Engineer', 'Software Engineer', 'Full-Stack Developer', 'Problem Solver'];

export default function Hero() {
  const { content } = useContent();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="min-h-screen w-full flex items-center justify-center relative px-8 md:px-12 lg:px-20 pt-28 pb-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Large gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.07] blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-yellow-500/[0.05] blur-[100px] animate-[pulse-glow_10s_ease-in-out_infinite_3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[150px] animate-[pulse-glow_12s_ease-in-out_infinite_1s]" />
      </div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10">
        {/* Text Content */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1 lg:col-span-7">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 backdrop-blur-md flex items-center gap-3"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-semibold text-yellow-300 uppercase tracking-widest">Available for work</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-gradient">{content.hero.line1}</span><br />
            <span className="text-gradient-primary">{content.hero.highlight}</span><br />
            <span className="text-gradient">{content.hero.line2}</span>
          </motion.h1>



          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed"
          >
            {content.hero.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a href="#projects">
              <Button variant="default" size="lg" className="w-full sm:w-auto gap-2 px-8 py-6 text-base transition-all duration-300">
                View Projects <ArrowRight size={18} />
              </Button>
            </a>
            <a href="#contact" className="group relative">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 px-8 py-6 text-base border-white/10 hover:border-[#d97706]/40 hover:text-[#d97706] transition-all duration-500">
                <span className="relative z-10 flex items-center gap-2">
                  Let's Connect
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </span>
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-12 items-center mt-14 pt-8 border-t border-white/[0.06] w-full"
          >
            <div className="flex flex-col">
              <span className="text-4xl font-display font-bold text-white">{content.hero.yearsExperience}</span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-medium mt-1.5">Years Experience</span>
            </div>
            <div className="w-px h-12 bg-white/[0.08]" />
            <div className="flex flex-col">
              <span className="text-4xl font-display font-bold text-white">{content.hero.projectsShipped}</span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-medium mt-1.5">Projects Shipped</span>
            </div>
          </motion.div>
        </div>

        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2 w-full flex justify-center relative lg:col-span-5"
        >
          <div className="relative">
            {/* Outer rings (removed to keep rounded rectangle clean) */}

            {/* Orbiting elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(251, 191, 36,0.6)] animate-[orbit_8s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(252, 211, 77,0.5)] animate-[orbit-reverse_12s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)] animate-[orbit_15s_linear_infinite_2s]" />
            </div>

            {/* Image container */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem]">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-background border border-white/10">
                <img
                  src={content.hero.profileImage}
                  alt="Petros Geto"
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </div>


          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/10 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
