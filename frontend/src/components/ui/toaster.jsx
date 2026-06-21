import { useState, useEffect } from 'react';

let listeners = [];
let toastCount = 0;

export function toast({ title, description, variant = 'default' }) {
  const id = ++toastCount;
  const t = { id, title, description, variant };
  listeners.forEach((fn) => fn({ type: 'add', toast: t }));
  setTimeout(() => {
    listeners.forEach((fn) => fn({ type: 'remove', id }));
  }, 4000);
}

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handler(action) {
      if (action.type === 'add') {
        setToasts((prev) => [...prev, action.toast]);
      } else {
        setToasts((prev) => prev.filter((t) => t.id !== action.id));
      }
    }
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded border px-5 py-4 shadow-lg max-w-sm text-sm ${
            t.variant === 'destructive'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-white text-gray-900 border-gray-200'
          }`}
        >
          {t.title && <p className="font-semibold mb-0.5">{t.title}</p>}
          {t.description && <p className="text-xs opacity-80">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}
