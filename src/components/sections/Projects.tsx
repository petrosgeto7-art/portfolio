import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Globe } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Project } from '../../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiFetch('/projects');
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Use projects from database
  const displayProjects = projects;

  return (
    <section id="projects" className="w-full py-32 px-6 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="section-label">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              <span className="text-gradient">Selected Works.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs">Crafted with attention to detail, performance, and user experience.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-3xl overflow-hidden glass-card group cursor-pointer flex flex-col hover:border-white/[0.15] transition-all duration-500"
            >
              {/* Background image */}
              <div className="relative h-64 overflow-hidden shrink-0">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/5 flex items-center justify-center">
                    <span className="text-7xl font-display font-bold text-amber-500/30 select-none">
                      {project.title?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />

                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content area */}
              <div className="p-8 flex flex-col flex-1 relative bg-black/20">
                {/* Tech tags */}
                <div className="flex gap-2 mb-5 flex-wrap">
                  {project.technologies.slice(0, 4).map(tech => (
                    <span
                      key={tech}
                      className="bg-amber-500/10 text-yellow-400 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-amber-500/20 uppercase tracking-widest backdrop-blur-md"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="bg-white/5 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/10 uppercase tracking-widest backdrop-blur-md">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                  {project.description}
                </p>

                {/* Action buttons */}
                <div className="flex gap-3 mt-auto pt-6 border-t border-white/[0.04]">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] text-white text-sm font-medium hover:bg-white/[0.1] transition-all duration-300 backdrop-blur-md border border-white/[0.05]"
                  >
                    <Github size={16} /> GitHub
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#d97706] text-white text-sm font-medium hover:bg-[#b45309] transition-all duration-300"
                  >
                    Deployed Link <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
