import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export interface CertificateContent {
  title: string;
  issuer: string;
  date: string;
  image: string;
}

export interface SkillItem {
  name: string;
  color: string;
  iconUrl?: string;
}

export interface SkillGroup {
  category: string;
  icon?: string;
  items: SkillItem[];
}

export interface PortfolioContent {
  brand: {
    firstName: string;
    lastName: string;
  };
  hero: {
    line1: string;
    highlight: string;
    line2: string;
    description: string;
    yearsExperience: string;
    projectsShipped: string;
    profileImage: string;
  };
  about: {
    heading: string;
    description1: string;
    description2: string;
    aboutImage: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    telegramUrl: string;
    telegramText: string;
    githubUrl: string;
    githubText: string;
    linkedinUrl: string;
    linkedinText: string;
    location: string;
  };
  certificates: CertificateContent[];
  skillsSection: {
    heading: string;
    description: string;
  };
  skills: SkillGroup[];
}

export const defaultContent: PortfolioContent = {
  brand: {
    firstName: "PETROS",
    lastName: "GETO"
  },
  hero: {
    line1: "Software Engineering",
    highlight: "the AI-driven future",
    line2: "with passion.",
    description: "Software Engineer & AI Builder. Passion-driven developer specializing in intelligent systems, minimalist design, and scalable architectures.",
    yearsExperience: "03+",
    projectsShipped: "20+",
    profileImage: "/804bb596-09e0-476a-bd0f-42a2604ad72d.png"
  },
  about: {
    heading: "Driven by innovation.",
    description1: "I am a Software Engineer and AI enthusiast passionate about crafting digital experiences that live at the intersection of beautiful design, robust architecture, and artificial intelligence.",
    description2: "My approach focuses on creating scalable, intelligent systems with a user-first mentality. I'm deeply driven to explore the bleeding edge of web technologies and machine learning.",
    aboutImage: ""
  },
  contact: {
    email: "hello@example.com",
    phone: "+1 (234) 567-890",
    whatsapp: "+1 (234) 567-890",
    telegramUrl: "https://t.me/username",
    telegramText: "t.me/username",
    githubUrl: "https://github.com",
    githubText: "github.com/username",
    linkedinUrl: "https://linkedin.com",
    linkedinText: "linkedin.com/in/username",
    location: "San Francisco, CA"
  },
  certificates: [
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2025', image: 'https://images.unsplash.com/photo-1523289217630-0dd16184af8e?q=80&w=600&auto=format&fit=crop' },
    { title: 'Meta Front-End Developer Professional', issuer: 'Coursera', date: '2024', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600&auto=format&fit=crop' },
    { title: 'Advanced React Patterns', issuer: 'Frontend Masters', date: '2024', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop' }
  ],
  skillsSection: {
    heading: "Technical Arsenal.",
    description: "I engineer intelligent, high-performance web systems by leveraging cutting-edge AI models and modern frameworks. My focus is on designing scalable architectures, writing robust code, and delivering seamless, impactful user experiences."
  },
  skills: [
    { category: 'AI & Data', icon: '🤖', items: [{name: 'Gemini AI', color: 'bg-indigo-500'}, {name: 'TensorFlow', color: 'bg-orange-500'}, {name: 'Python', color: 'bg-blue-400'}, {name: 'LangChain', color: 'bg-green-500'}, {name: 'Pandas', color: 'bg-purple-500'}] },
    { category: 'Frontend & UI', icon: '🎨', items: [{name: 'React 19', color: 'bg-yellow-400'}, {name: 'Next.js', color: 'bg-white'}, {name: 'TypeScript', color: 'bg-blue-500'}, {name: 'Tailwind CSS', color: 'bg-cyan-500'}, {name: 'Framer Motion', color: 'bg-pink-500'}] },
    { category: 'Backend & Cloud', icon: '⚙️', items: [{name: 'Node.js', color: 'bg-green-500'}, {name: 'Django', color: 'bg-emerald-600'}, {name: 'PostgreSQL', color: 'bg-blue-400'}, {name: 'Docker', color: 'bg-blue-600'}, {name: 'Supabase', color: 'bg-emerald-500'}] }
  ]
};

const ContentContext = createContext<{ content: PortfolioContent; loading: boolean }>({
  content: defaultContent,
  loading: true,
});

export const useContent = () => useContext(ContentContext);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PortfolioContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await apiFetch('/settings');
        if (data && Object.keys(data).length > 0) {
          if (!data.certificates) data.certificates = defaultContent.certificates;
          if (!data.skillsSection) data.skillsSection = defaultContent.skillsSection;
          if (!data.skills) data.skills = defaultContent.skills;
          setContent(data as PortfolioContent);
        } else {
          setContent(defaultContent);
        }
      } catch (err) {
        console.error("Failed to fetch content", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading }}>
      {children}
    </ContentContext.Provider>
  );
};
