import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Create service request
export const createServiceRequest = async (requestData) => {
  const response = await api.post("/api/requests", requestData);
  return response.data;
};

// Get user's service requests
export const getUserRequests = async () => {
  const response = await api.get("/api/requests");
  return response.data;
};

// Update request status (admin only)
export const updateRequestStatus = async (requestId, statusData) => {
  const response = await api.put(`/api/requests/${requestId}`, statusData);
  return response.data;
};

// Get all requests (admin only)
export const getAllRequests = async () => {
  const response = await api.get("/api/admin/requests");
  return response.data;
};

// Get request history (status history / progress history)
export const getRequestHistory = async (requestId) => {
  const response = await api.get(`/api/requests/${requestId}/history`);
  return response.data;
};