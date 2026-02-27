// src/services/api.js
import axios from 'axios';

// Base URL comes from environment variable
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s — AI calls can be slow
});

// ── Response interceptor for consistent error messages ──
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── API methods ──────────────────────────────────────────────

/** Connect to a MySQL database using credentials */
export const connectDatabase = (credentials) =>
  api.post('/upload/connect', credentials).then((r) => r.data);

/** Upload a .sql file to create + import a database */
export const uploadSQLFile = (formData) =>
  api.post('/upload/sql-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

/** Fetch the schema as JSON */
export const getSchema = () =>
  api.get('/schema/').then((r) => r.data);

/** Fetch schema rendered as ASCII tables */
export const getSchemaAscii = () =>
  api.get('/schema/ascii').then((r) => r.data.ascii_schema);

/** Generate SQL from a natural-language question */
export const generateQuery = (question) =>
  api.post('/query/', { question }).then((r) => r.data);

export default api;
