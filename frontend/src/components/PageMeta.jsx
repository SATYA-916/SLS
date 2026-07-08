import { useEffect } from 'react';

/**
 * PageMeta — sets document title and meta description per page.
 * Usage: <PageMeta title="About Us" description="Learn about SLS Consultants..." />
 */
export function PageMeta({ title, description }) {
  useEffect(() => {
    const BASE = 'SLS Consultants';
    document.title = title ? `${title} | ${BASE}` : `${BASE} | Structural & Mechanical Engineering Since 2002`;

    if (description) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement('meta');
        el.name = 'description';
        document.head.appendChild(el);
      }
      el.content = description;
    }
  }, [title, description]);

  return null;
}
