import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

export const login = (username, password) =>
  axios.post(`${API_BASE}login/`, { username, password });
// Fix: Remove 'auth/' if your backend uses /api/login/

export const uploadCSV = (file, token) => {
  const form = new FormData();
  form.append("file", file);
  return axios.post(`${API_BASE}upload/`, form, {
    headers: { Authorization: `Token ${token}` },
  });
};

export const register = data =>
  axios.post(`${API_BASE}register/`, data);

export const fetchHistory = (token) =>
  axios.get(`${API_BASE}history/`, {
    headers: { Authorization: `Token ${token}` },
  });

export const fetchSummary = (id, token) =>
  axios.get(`${API_BASE}summary/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
