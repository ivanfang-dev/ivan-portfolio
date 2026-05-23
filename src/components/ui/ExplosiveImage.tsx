import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ExplosiveImageProps {
  src: string;
  alt: string;
  className?: string;
  explosionThreshold?: number;
  surpriseImage?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
}

const ExplosiveImage: React.FC<ExplosiveImageProps> = ({
  src,
  alt,
  className = '',
  explosionThreshold = 5,
  surpriseImage = `${import.meta.env.BASE_URL}IMG_5788-modified.png`,
  objectFit = 'contain',
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleClick = useCallback(() => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    const element = document.getElementById('explosive-image');
    if (element) {
      element.style.animation = 'none';
      element.offsetHeight;
      element.style.animation = 'shake 0.5s ease-in-out';
    }

    if (newClickCount >= explosionThreshold && !isExploded) {
      // Confetti burst centered on the image (skipped under reduced motion).
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (element && !prefersReduced) {
        const rect = element.getBoundingClientRect();
        const origin = {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        };
        const colors = ['#2774ae', '#ffd100', '#8bb8e8', '#ffffff'];
        confetti({ particleCount: 220, spread: 80, startVelocity: 45, origin, colors, scalar: 0.9, zIndex: 9999 });
        confetti({ particleCount: 160, spread: 120, startVelocity: 30, origin, colors, scalar: 0.7, zIndex: 9999 });
      }

      setIsExploded(true);

      setTimeout(() => setShowSurprise(true), 800);
      setTimeout(() => {
        setIsExploded(false);
        setShowSurprise(false);
        setClickCount(0);
      }, 8000);
    }
  }, [clickCount, explosionThreshold, isExploded]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (clickCount === 0) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 4000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  return (
    <div className="relative flex flex-col items-center">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>

      <AnimatePresence>
        {showHint && clickCount === 0 && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium z-9999 shadow-lg"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-1">
              <span>Try clicking me!</span>
              <span className="animate-bounce">👆</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {clickCount > 0 && clickCount < explosionThreshold && (
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm z-9999"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {explosionThreshold - clickCount} more clicks! 🎯
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        id="explosive-image"
        className={`relative cursor-pointer select-none ${className} group`}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400 pointer-events-none"
          animate={{ scale: [1, 1.05, 1], opacity: [0, 0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="text-white text-sm font-medium bg-black bg-opacity-75 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
            initial={{ scale: 0.8, y: 10 }}
            whileHover={{ scale: 1, y: 0 }}
          >
            Click me! 🎉
          </motion.div>
        </motion.div>

        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-${objectFit}`}
          animate={{
            opacity: showSurprise ? 0 : isExploded ? 0.3 : 1,
            scale: isExploded ? 0.8 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {showSurprise && (
          <motion.div
            className="absolute inset-0 z-10 bg-white rounded-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img src={surpriseImage} alt="Surprise!" className="w-full h-full object-contain" />
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🎉✨🎊
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ExplosiveImage;
