const mongoose = require('mongoose');

// The project schema matches the one in server.ts
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  technologies: [String],
  thumbnail: String,
  githubUrl: String,
  liveUrl: String,
  slug: { type: String, unique: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now }
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petros_portfolio');
  
  // Clear existing projects just in case
  await Project.deleteMany({});
  console.log("Cleared existing projects");

  const projects = [
    {
      title: 'SkillSwap DBU', 
      description: 'A peer-to-peer educational platform for Debre Berhan University students. Features include an AI-powered matching engine, real-time live chat via WebSockets, passwordless OTP verification, and an interactive swipe deck to find study partners.', 
      technologies: ['React', 'Django', 'Gemini AI', 'Supabase', 'Tailwind', 'WebSockets'], 
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', 
      githubUrl: '#', 
      liveUrl: '#', 
      slug: 'skillswap', content: '', featured: true, order: 1, createdAt: Date.now()
    },
    {
      title: 'QueryChatBot (IMDb AI)', 
      description: "A Flask-based application that allows users to query a SQLite database using natural language. It leverages Google's Gemini AI to translate questions into SQL queries, executes them, and displays results in a responsive interface.", 
      technologies: ['Flask', 'Python', 'SQLite', 'Gemini AI', 'Tailwind'], 
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800', 
      githubUrl: '#', 
      liveUrl: '#', 
      slug: 'querychatbot', content: '', featured: true, order: 2, createdAt: Date.now()
    },
    {
      title: 'GPA Pro: Academic Advisor', 
      description: 'A high-performance academic management PWA featuring an AI-driven advisor powered by Gemini 2.5 Flash, interactive analytics with Chart.js, and professional transcript generation.', 
      technologies: ['JavaScript', 'Flask'], 
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', 
      githubUrl: '#', 
      liveUrl: '#', 
      slug: 'gpapro', content: '', featured: true, order: 3, createdAt: Date.now()
    }
  ];

  await Project.insertMany(projects);
  console.log("Seeded default projects successfully!");
  
  await mongoose.disconnect();
}

seed().catch(console.error);
