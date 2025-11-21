import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

// ---------- AUTH ----------
export const login = (username, password) =>
  axios.post(`${API_BASE}login/`, { username, password });

export const register = data =>
  axios.post(`${API_BASE}register/`, data);

// ---------- UPLOAD ----------
export const uploadCSV = (file, token) => {
  const form = new FormData();
  form.append("file", file);
  return axios.post(`${API_BASE}upload/`, form, {
    headers: { Authorization: `Token ${token}` },
  });
};

// ---------- HISTORY ----------
export const fetchHistory = (token) =>
  axios.get(`${API_BASE}history/`, {
    headers: { Authorization: `Token ${token}` },
  });

// ---------- SUMMARY ----------
export const fetchSummary = (id, token) =>
  axios.get(`${API_BASE}summary/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });

// ---------- DELETE SINGLE DATASET ----------
export const deleteDataset = (id, token) =>
  axios.delete(`${API_BASE}dataset/delete/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
