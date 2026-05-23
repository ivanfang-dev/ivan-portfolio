import { Navbar, Hero, TechStack, About, Projects, Experience, Education, Resume, Footer } from './components';
import { useScrollSpy } from './hooks';
import { scrollToTop } from './utils/smoothScroll';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

function App() {
  const activeSection = useScrollSpy(['hero', 'about', 'projects', 'experience', 'education', 'resume']);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-10 h-10 border-2 border-ink-faint/20 border-t-ucla-blue rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-caption text-ink-faint">Ivan Fang</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-canvas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-ucla-blue origin-left z-[60]"
          style={{ scaleX: scrollYProgress }}
        />

        <Navbar />

        <main className="relative">
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <Experience />
          <Education />
          <Resume />
        </main>

        <Footer />

        {/* Scroll to top */}
        <motion.button
          className="fixed bottom-8 right-8 z-40 grid place-items-center h-12 w-12 rounded-full bg-white/80 backdrop-blur border border-hairline text-ink shadow-lg hover:text-ucla-blue transition-colors"
          onClick={() => scrollToTop({ duration: 400 })}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: activeSection !== 'hero' ? 1 : 0,
            scale: activeSection !== 'hero' ? 1 : 0,
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
