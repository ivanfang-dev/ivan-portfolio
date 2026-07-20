import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigationScrollSpy } from '../../hooks/useScrollSpy';
import { scrollToSection } from '../../utils/smoothScroll';
import Button from '../ui/Button';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface NavbarProps {
  className?: string;
  activeSection?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'experience', label: 'Experience', href: '#experience' },
  ];

  const resumeUrl = `${import.meta.env.BASE_URL}Ivan_Fang_Resume.pdf`;

  const activeSection = useNavigationScrollSpy(navItems.map((item) => item.id));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = async (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setPendingSection(sectionId);
    try {
      await scrollToSection(sectionId);
    } finally {
      setTimeout(() => setPendingSection(null), 2000);
    }
  };

  const displayActiveSection = pendingSection || activeSection;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-hairline' : 'bg-transparent'
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.button
            onClick={() => handleNavClick('hero')}
            className="text-heading-3 font-semibold text-ink hover:text-ucla-blue transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ivan Fang
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = displayActiveSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink/[0.06]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors duration-200"
            >
              Resume
            </a>

            <div className="ml-3">
              <Button variant="primary" size="sm" magnetic onClick={() => handleNavClick('contact')}>
                Get in touch
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-ink hover:text-ucla-blue transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden mobile-menu overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-4 pt-2 pb-5 space-y-1 bg-white/90 backdrop-blur-xl border-t border-hairline">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    displayActiveSection === item.id
                      ? 'text-ucla-blue bg-surface'
                      : 'text-ink-soft hover:text-ink hover:bg-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-ink-soft hover:text-ink hover:bg-surface transition-colors"
              >
                Resume
              </a>
              <button
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white bg-ucla-blue hover:bg-accent-hover transition-colors mt-2"
              >
                Get in touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
