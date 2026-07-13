import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import StarField from '../components/ui/StarField';


export default function Portfolio() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden opacity-100 transition-opacity duration-500">
        {/* Universe starfield (very subtle) */}
        <StarField />

        <Navigation />

        <main className="flex flex-col items-center w-full">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
