import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Phone, Sun, Moon } from 'lucide-react';

// WhatsApp SVG
function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3">

      {/* Dark Theme Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(prev => !prev)}
        aria-label="Toggle dark mode"
        className="w-10 h-10 bg-white border border-slate-200 shadow-md dark:bg-[#0d1e36] dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#1a2f4c] transition-all duration-200 rounded-full"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </motion.button>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-10 h-10 bg-white border border-slate-200 shadow-md text-[#0a1628] flex items-center justify-center hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-all duration-200 rounded-full"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable action hub */}
      <div className="flex flex-col items-end gap-2">
        <AnimatePresence>
          {expanded && (
            <>
              {/* WhatsApp */}
              <motion.a
                key="whatsapp"
                href="https://wa.me/919849598424?text=Hello%20SLS%20Consultants%2C%20I%20have%20an%20engineering%20enquiry."
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.18, delay: 0.05 }}
                className="flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 rounded-full shadow-lg text-xs font-bold hover:bg-[#20bc5a] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </motion.a>

              {/* Call */}
              <motion.a
                key="call"
                href="tel:+919849598424"
                aria-label="Call SLS Consultants"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2 bg-[#0a1628] text-white px-3 py-2 rounded-full shadow-lg text-xs font-bold hover:bg-[#1a2f4c] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call Now</span>
              </motion.a>
            </>
          )}
        </AnimatePresence>

        {/* Main FAB toggle */}
        <motion.button
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Close contact options' : 'Contact us'}
          whileTap={{ scale: 0.92 }}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
            expanded
              ? 'bg-slate-700 text-white'
              : 'bg-[#25D366] text-white'
          }`}
        >
          <motion.div
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {expanded ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <WhatsAppIcon className="w-7 h-7" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
