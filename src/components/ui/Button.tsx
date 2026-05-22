import React from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { EASE } from '../../utils/motion';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /** Cursor-magnetic pull — reserve for primary CTAs. */
  magnetic?: boolean;
  ariaLabel?: string;
}

const baseStyles =
  'relative inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

const variantStyles = {
  primary: 'bg-ucla-blue text-white hover:bg-accent-hover shadow-sm',
  secondary: 'bg-white text-ink border border-hairline hover:bg-surface',
  outline: 'bg-transparent text-ink border border-hairline hover:bg-surface',
  ghost: 'bg-transparent text-ink hover:text-ucla-blue',
};

const sizeStyles = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-base',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className = '',
  disabled = false,
  type = 'button',
  magnetic = false,
  ariaLabel,
}) => {
  const magnet = useMagnetic<HTMLElement>(0.4);

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const interaction = disabled
    ? {}
    : {
        whileHover: { scale: variant === 'ghost' ? 1 : 1.02 },
        whileTap: { scale: 0.97 },
        transition: { duration: 0.2, ease: EASE },
      };

  const magneticAttrs = magnetic
    ? {
        onMouseMove: magnet.onMouseMove,
        onMouseLeave: magnet.onMouseLeave,
        style: magnet.style,
      }
    : {};

  if (href) {
    return (
      <motion.a
        ref={magnetic ? (magnet.ref as unknown as React.RefObject<HTMLAnchorElement>) : undefined}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={combinedClassName}
        onClick={onClick}
        {...interaction}
        {...magneticAttrs}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={magnetic ? (magnet.ref as unknown as React.RefObject<HTMLButtonElement>) : undefined}
      type={type}
      aria-label={ariaLabel}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      {...interaction}
      {...magneticAttrs}
    >
      {children}
    </motion.button>
  );
};

export default Button;
