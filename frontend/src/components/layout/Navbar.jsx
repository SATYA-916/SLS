import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CALENDLY_URL = 'https://calendly.com/sls-consultants/30min';

function useCalendly() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.getElementById('calendly-css')) {
      const link = document.createElement('link');
      link.id   = 'calendly-css';
      link.rel  = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    if (!document.getElementById('calendly-js')) {
      const script  = document.createElement('script');
      script.id     = 'calendly-js';
      script.src    = 'https://assets.calendly.com/assets/external/widget.js';
      script.async  = true;
      script.onload = () => setReady(true);
      document.body.appendChild(script);
    } else if (window.Calendly) {
      setReady(true);
    }
  }, []);

  const openPopup = useCallback(() => {
    try {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      } else {
        window.open(CALENDLY_URL, '_blank');
      }
    } catch (e) {
      window.open(CALENDLY_URL, '_blank');
    }
  }, []);

  return { openPopup };
}

const navLinks = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/codes',    label: 'Codes & Standards' },
  { href: '/gallery',  label: 'Gallery'  },
  { href: '/contact',  label: 'Contact'  },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location]  = useLocation();
  const { openPopup } = useCalendly();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col cursor-pointer shrink-0" onClick={() => setMenuOpen(false)}>
          <span className="text-base font-bold text-[#0a1628] leading-tight">SLS Consultants</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-[0.12em] hidden sm:block">
            Engineering. Structures. Industrial Solutions. Since 2002.
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          <nav className="flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors relative py-1 ${
                  location === link.href
                    ? 'text-[#0a1628] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0a1628]'
                    : 'text-gray-500 hover:text-[#0a1628]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Opens Calendly popup directly — distinct from Contact nav link */}
          <button
            onClick={openPopup}
            className="ml-6 flex items-center gap-1.5 bg-[#0a1628] text-white hover:bg-[#43648e] transition-colors rounded px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Book a Call
          </button>
        </div>

        <button
          className="md:hidden p-2 text-gray-500 hover:text-[#0a1628] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <nav className="container mx-auto px-4 py-2 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 px-2 text-sm font-medium border-b border-gray-100 transition-colors ${
                    location === link.href
                      ? 'text-[#0a1628] font-semibold'
                      : 'text-gray-500 hover:text-[#0a1628]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile: opens Calendly popup */}
              <button
                onClick={() => { setMenuOpen(false); openPopup(); }}
                className="my-3 bg-[#0a1628] text-white text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                Book a Call
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
