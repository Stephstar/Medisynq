// frontend_html/config.js
// Replace API_BASE if you change your Render domain.
const API_BASE = 'https://medisynq-1.onrender.com/api/';
const JWT_KEY = 'access';

function authHeaders() {
  const token = localStorage.getItem(JWT_KEY);
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function jsonHeaders() {
  return { 'Content-Type': 'application/json', ...authHeaders() };
}
