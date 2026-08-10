import { useState, useEffect, useCallback } from 'react';

// ── Calendly Configuration ──────────────────────────────────────────────────
// Replace this URL with your actual Calendly link once you create a free account
// at https://calendly.com  →  copy your personal scheduling link here
export const CALENDLY_URL = 'https://calendly.com/slsvizag/30min';

// Hook: dynamically loads Calendly widget script + CSS once, then exposes
// an openPopup() helper usable from any component (forms, CTAs, modals).
export function useCalendly() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load Calendly CSS
    if (!document.getElementById('calendly-css')) {
      const link = document.createElement('link');
      link.id   = 'calendly-css';
      link.rel  = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    // Load Calendly JS
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

  return { openPopup, ready };
}
