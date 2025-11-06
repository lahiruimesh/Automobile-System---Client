import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with auth header
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

// ==================== ASSIGNMENTS ====================

export const getMyAssignments = async () => {
  const response = await api.get("/employee/assignments");
  return response.data;
};

export const getAssignmentById = async (assignmentId) => {
  const response = await api.get(`/employee/assignments/${assignmentId}`);
  return response.data;
};

// ==================== TIME LOGS ====================

export const createTimeLog = async (timeLogData) => {
  const response = await api.post("/employee/time-logs", timeLogData);
  return response.data;
};

export const getMyTimeLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.service_id) params.append("service_id", filters.service_id);
  if (filters.start_date) params.append("start_date", filters.start_date);
  if (filters.end_date) params.append("end_date", filters.end_date);
  if (filters.status) params.append("status", filters.status);

  const response = await api.get(`/employee/time-logs?${params.toString()}`);
  return response.data;
};

export const updateTimeLog = async (timeLogId, timeLogData) => {
  const response = await api.put(`/employee/time-logs/${timeLogId}`, timeLogData);
  return response.data;
};

export const deleteTimeLog = async (timeLogId) => {
  const response = await api.delete(`/employee/time-logs/${timeLogId}`);
  return response.data;
};

// ==================== REPORTS ====================

export const getWeeklyReport = async (weekStart) => {
  const params = weekStart ? `?week_start=${weekStart}` : "";
  const response = await api.get(`/employee/reports/weekly${params}`);
  return response.data;
};

export const getMonthlyReport = async (year, month) => {
  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (month) params.append("month", month);

  const response = await api.get(`/employee/reports/monthly?${params.toString()}`);
  return response.data;
};

// ==================== SERVICE MANAGEMENT ====================

export const getServiceStats = async (serviceId) => {
  const response = await api.get(`/employee/services/${serviceId}/stats`);
  return response.data;
};

export const updateServiceStatus = async (serviceId, status) => {
  const response = await api.patch(`/employee/services/${serviceId}/status`, { status });
  return response.data;
};
