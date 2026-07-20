import { Navbar, Hero, About, Projects, Experience, Footer } from './components';
import { useScrollSpy } from './hooks';
import { scrollToTop } from './utils/smoothScroll';
import { motion, useScroll } from 'framer-motion';

function App() {
  const activeSection = useScrollSpy(['hero', 'about', 'projects', 'experience']);
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-canvas">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-ucla-blue origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      <Navbar />

      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Experience />
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
    </div>
  );
}

export default App;
