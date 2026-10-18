import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { EASE } from '../../utils/motion';

export interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

type Status = 'idle' | 'copied' | 'failed';

/** Clipboard API first; the hidden-textarea fallback covers insecure origins and older Safari. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/**
 * Sits beside the mailto pill for everyone whose mail client isn't the
 * default handler (most recruiters on webmail). The clipboard icon redraws
 * itself as a check, and a bubble says thanks — also announced to screen readers.
 */
const CopyEmailButton: React.FC<CopyEmailButtonProps> = ({ email, className = '' }) => {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [hinting, setHinting] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async () => {
    const ok = await copyText(email);
    setStatus(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), ok ? 2400 : 5000);
  };

  const bubble =
    status === 'copied'
      ? 'Copied! Talk soon 👋'
      : status === 'failed'
        ? `Couldn't copy. It's ${email}`
        : hinting
          ? 'Copy email'
          : null;

  const copied = status === 'copied';

  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHinting(true)}
        onMouseLeave={() => setHinting(false)}
        onFocus={(e) => setHinting(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setHinting(false)}
        aria-label={`Copy email address ${email}`}
        className={`grid place-items-center h-11 w-11 rounded-full border transition-colors duration-200 ${
          copied
            ? 'bg-ucla-gold border-ucla-gold text-ink'
            : 'border-white/25 text-white hover:text-ucla-gold hover:border-ucla-gold/60'
        }`}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.9 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.svg
              key="check"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.25}
              aria-hidden
              initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              <motion.path
                d="M4.5 12.75l6 6 9-13.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.32, ease: EASE, delay: 0.06 }}
              />
            </motion.svg>
          ) : (
            <motion.span
              key="clip"
              className="grid place-items-center"
              initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <ClipboardDocumentIcon className="h-5 w-5" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Speech bubble — hover hint, then the confirmation. */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={status === 'idle' ? 'hint' : status}
            aria-hidden
            className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: reduce ? 0 : 6, scale: reduce ? 1 : 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 4, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 520, damping: 30 }}
            style={{ transformOrigin: '50% 100%' }}
          >
            <span
              className={`relative block w-max max-w-[15rem] rounded-lg px-3 py-1.5 text-sm font-medium shadow-[0_6px_20px_-6px_rgba(0,0,0,0.45)] ${
                status === 'idle' ? 'bg-white text-ink' : 'bg-ucla-gold text-ink'
              }`}
            >
              {bubble}
              <span
                className={`absolute top-full left-1/2 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent ${
                  status === 'idle' ? 'border-t-white' : 'border-t-ucla-gold'
                }`}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <span role="status" className="sr-only">
        {status === 'copied' ? 'Email address copied to clipboard.' : status === 'failed' ? `Couldn't copy. The address is ${email}.` : ''}
      </span>
    </div>
  );
};

export default CopyEmailButton;
