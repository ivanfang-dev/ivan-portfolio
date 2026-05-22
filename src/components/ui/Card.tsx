import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../utils/motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  onClick,
}) => {
  const baseStyles =
    'bg-white rounded-2xl border border-hairline overflow-hidden';

  const hoverVariants = {
    initial: {
      y: 0,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    },
    hover: {
      y: -6,
      boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.4, ease: EASE },
    },
  };

  const staticVariants = {
    initial: { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)' },
  };

  const combinedClassName = `${baseStyles} ${className} ${onClick ? 'cursor-pointer' : ''}`;

  return (
    <motion.div
      className={combinedClassName}
      variants={hover ? hoverVariants : staticVariants}
      initial="initial"
      whileHover={hover ? 'hover' : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
