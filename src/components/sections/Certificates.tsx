import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../../contexts/ContentContext';
import { Award, ExternalLink } from 'lucide-react';

export default function Certificates() {
  const { content } = useContent();

  return (
    <section id="certificates" className="w-full py-32 px-6 relative">
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
          <p className="section-label">Learning</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            <span className="text-gradient">Certifications.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.certificates.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-3xl overflow-hidden group cursor-pointer relative"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Image */}
              <div className="w-full h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
                <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[5]" />
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-10 h-10 rounded-xl bg-background/60 backdrop-blur-xl border border-white/[0.1] flex items-center justify-center group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-all duration-300">
                    <Award size={18} className="text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-400 text-[11px] font-semibold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {cert.date}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors duration-300 leading-snug">
                  {cert.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium">{cert.issuer}</p>

                {/* Hover link indicator */}
                <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="font-medium">View Certificate</span>
                  <ExternalLink size={14} />
                </div>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-amber-500/20 transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
