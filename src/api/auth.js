import axios from "axios";

const API = "http://localhost:5000"; // backend

export const signup = (data) => axios.post(`${API}/api/auth/signup`, data);
export const login = (data) => axios.post(`${API}/api/auth/login`, data);
export const getPendingEmployees = (token) =>
  axios.get(`${API}/admin/employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const approveEmployee = (id, token) =>
  axios.put(`${API}/admin/employees/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
