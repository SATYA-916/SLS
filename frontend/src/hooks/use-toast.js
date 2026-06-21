import { useState, useCallback } from 'react';

let listeners = [];
let toastCount = 0;

function dispatch(toast) {
  listeners.forEach((listener) => listener(toast));
}

export function toast({ title, description, variant = 'default' }) {
  const id = ++toastCount;
  dispatch({ id, title, description, variant, open: true });
  setTimeout(() => dispatch({ id, open: false }), 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addListener = useCallback((fn) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);

  return { toasts, addListener, toast };
}
