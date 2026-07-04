import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Shield } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sls_cookie_consent');
    if (!consent) {
      // Show banner after a brief delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sls_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('sls_cookie_consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-[#0a1628] text-white p-6 shadow-2xl border border-white/10 z-50 rounded-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-full shrink-0">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Cookie Consent & Privacy</h4>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                We use cookies to analyze traffic and optimize your experience. By continuing to browse, you agree to our{' '}
                <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>,{' '}
                <Link href="/terms" className="underline hover:text-white transition-colors">Terms of Service</Link>, and{' '}
                <Link href="/cookies" className="underline hover:text-white transition-colors">Cookie Policy</Link>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="border border-white/20 text-white hover:bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
