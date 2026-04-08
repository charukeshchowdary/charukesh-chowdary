const API_BASE = '/api';

const tokenStore = {
  get token() {
    return localStorage.getItem('tf_token');
  },
  set token(value) {
    if (value) localStorage.setItem('tf_token', value);
  },
  clear() {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
  },
  get user() {
    const value = localStorage.getItem('tf_user');
    return value ? JSON.parse(value) : null;
  },
  set user(data) {
    localStorage.setItem('tf_user', JSON.stringify(data));
  }
};

const fetchJson = async (url, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (tokenStore.token) headers.Authorization = `Bearer ${tokenStore.token}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};
