import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/expertise', label: 'Expertise' },
  { href: '/projects', label: 'Projects' },
  { href: '/vision', label: 'Vision' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col cursor-pointer shrink-0" onClick={() => setMenuOpen(false)}>
          <span className="text-base font-bold text-[#0a1628] leading-tight">SLS Consultants</span>
          <span className="text-[9px] text-gray-400 uppercase tracking-[0.12em] hidden sm:block">
            Engineering. Structures. Industrial Solutions. Since 2002.
          </span>
        </Link>

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

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0a1628] transition-colors border border-gray-200 hover:border-[#0a1628] rounded px-2.5 py-1.5"
            title="Admin Portal"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-gray-500 hover:text-[#0a1628] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="py-3 px-2 text-sm font-medium text-gray-400 hover:text-[#0a1628] transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
