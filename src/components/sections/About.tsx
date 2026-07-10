import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../../contexts/ContentContext';
import { Briefcase, GraduationCap, Code2, Rocket } from 'lucide-react';

export default function About() {
  const { content } = useContent();

  const stats = [
    { icon: Code2, label: 'Clean Code', value: 'Advocate' },
    { icon: Rocket, label: 'Scalable Systems', value: 'Builder' },
  ];

  return (
    <section id="about" className="w-full py-32 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16"
        >
          {/* Left Column - Text */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center">
            <p className="section-label">About Me</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-8">
              <span className="text-gradient">{content.about.heading}</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              {content.about.description1}
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              {content.about.description2}
            </p>

            {/* About Image */}
            {content.about.aboutImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10 rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src={content.about.aboutImage}
                  alt="About"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card-hover rounded-2xl p-5 group"
                >
                  <stat.icon className="w-5 h-5 text-amber-400 mb-3 group-hover:text-yellow-400 transition-colors" />
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

              <h4 className="section-label mb-10">Experience Timeline</h4>

              <div className="flex-1 space-y-10 relative">
                {/* Animated connector line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px">
                  <div className="w-full h-full bg-gradient-to-b from-amber-500 via-yellow-500 to-transparent opacity-30" />
                  <motion.div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-amber-400 to-transparent"
                    initial={{ height: "0%" }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>

                {/* Timeline Item 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative pl-12 group"
                >
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-amber-500 border-4 border-background shadow-[0_0_20px_rgba(251, 191, 36,0.4)] flex items-center justify-center">
                    <Briefcase size={10} className="text-white" />
                  </div>
                  <div className="glass-card-hover rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-base font-bold text-white">Full Stack Developer</h5>
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">Current</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Freelance • 2023 — Present</p>
                    <p className="text-sm text-slate-400 leading-relaxed">Building scalable web applications for diverse clients using modern tech stacks.</p>
                  </div>
                </motion.div>

                {/* Timeline Item 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="relative pl-12 group"
                >
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-yellow-500/50 border-4 border-background flex items-center justify-center">
                    <GraduationCap size={10} className="text-yellow-300" />
                  </div>
                  <div className="glass-card-hover rounded-2xl p-6">
                    <h5 className="text-base font-bold text-white mb-1">Software Engineering Student</h5>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-3">University • 2022 — Present</p>
                    <p className="text-sm text-slate-400 leading-relaxed">Focusing on algorithms, data structures, and modern web technologies.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
