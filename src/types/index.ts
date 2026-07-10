export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  createdAt: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools' | 'AI';
  proficiency: number;
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
  thumbnail?: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  availability: 'Available' | 'Employed' | 'Busy';
  yearsOfExperience: number;
}
