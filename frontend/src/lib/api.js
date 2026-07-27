const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
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

export function deleteContact(id) {
  return apiFetch(`/api/admin/contacts/${id}`, {
    method: 'DELETE',
  });
}

export function submitContact(data) {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: data,
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

export function adminForgotPassword(email) {
  return apiFetch('/api/admin/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function getAdminContacts() {
  return apiFetch('/api/admin/contacts');
}

export function updateContactStatus(id, status) {
  return apiFetch(`/api/admin/contacts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function addContactNote(id, text) {
  return apiFetch(`/api/admin/contacts/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function deleteContactNote(id, noteId) {
  return apiFetch(`/api/admin/contacts/${id}/notes/${noteId}`, {
    method: 'DELETE',
  });
}

export function getCSVExportUrl() {
  return `${API_URL}/api/admin/contacts/export`;
}

// ══════════════════════════════════════════
// ADMIN — SERVICES CRUD
// ══════════════════════════════════════════

export function getAdminServices() {
  return apiFetch('/api/admin/servicesdata');
}

export function createService(data) {
  return apiFetch('/api/admin/servicesdata', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateService(id, data) {
  return apiFetch(`/api/admin/servicesdata/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteAdminService(id) {
  return apiFetch(`/api/admin/servicesdata/${id}`, {
    method: 'DELETE',
  });
}

// ══════════════════════════════════════════
// ADMIN — PROJECTS CRUD
// ══════════════════════════════════════════

export function getAdminProjects() {
  return apiFetch('/api/admin/projectsdata');
}

export function createProject(data) {
  return apiFetch('/api/admin/projectsdata', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProject(id, data) {
  return apiFetch(`/api/admin/projectsdata/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteAdminProject(id) {
  return apiFetch(`/api/admin/projectsdata/${id}`, {
    method: 'DELETE',
  });
}

// ══════════════════════════════════════════
// ADMIN — IMAGE UPLOAD
// ══════════════════════════════════════════

export function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  return apiFetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
}
