async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function getStats() {
  return apiFetch('/api/stats');
}

export function getProjects() {
  return apiFetch('/api/projects');
}

export function getServices() {
  return apiFetch('/api/services');
}

export function submitContact(data) {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function adminLogin(password) {
  return apiFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function adminLogout() {
  return apiFetch('/api/admin/logout', { method: 'POST' });
}

export function getAdminContacts() {
  return apiFetch('/api/admin/contacts');
}
