import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../../contexts/ContentContext';

export default function Skills() {
  const { content } = useContent();
  const { heading, description } = content.skillsSection || {
    heading: "Technical Arsenal.",
    description: "I engineer intelligent, high-performance web systems by leveraging cutting-edge AI models and modern frameworks. My focus is on designing scalable architectures, writing robust code, and delivering seamless, impactful user experiences."
  };

  return (
    <section id="skills" className="w-full py-32 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="section-label">Core Tech Stack</p>
          <div className="mt-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
              <span className="text-gradient">{heading}</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-white/[0.15] transition-all duration-500"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category header */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">{skillGroup.icon || '💻'}</span>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {skillGroup.category}
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {skillGroup.items.map((item, i) => {
                  const iconUrl = item.iconUrl || `https://cdn.simpleicons.org/${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/white`;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + i * 0.05 }}
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-4 p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 cursor-default group/item`}
                    >
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt={item.name} className="w-5 h-5 object-contain" />
                      ) : (
                        <img src={iconUrl} alt={item.name} className="w-5 h-5 object-contain" onError={(e) => {
                           (e.target as HTMLImageElement).style.display = 'none';
                           if ((e.target as HTMLImageElement).nextElementSibling) {
                             ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'block';
                           }
                        }} />
                      )}
                      <div className="w-2 h-2 rounded-full shadow-lg hidden" style={{backgroundColor: item.color || '#FCD34D'}} />
                      <span className="text-sm font-semibold text-slate-300 group-hover/item:text-white transition-colors">
                        {item.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
