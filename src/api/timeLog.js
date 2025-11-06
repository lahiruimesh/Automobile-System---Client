import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
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

// ==================== ADMIN ====================


export const getAllEmployees = async () => {
  const response = await api.get("/api/admin/employees/all");
  return response.data;
};

export const getTotalEmployees = async () => {
  const response = await api.get("/api/admin/employees/total");
  return response.data;
};

export const getTotalCustomers = async () => {
  const response = await api.get("/api/admin/customers/total");
  return response.data;
};

export const getTotalAppointments = async () => {
  const response = await api.get("/api/admin/appointments/total");
  return response.data;
};

export const getCompletedServices = async () => {
  const response = await api.get("/api/admin/services/total");
  return response.data;
}

export const addNewEmployee = async (employeeData) => {
  const response = await api.post("/api/admin/employees", employeeData);
  return response.data;
}

export const updateEmployee = async (employeeId, employeeData) => {
  const response = await api.put(`/api/admin/employees/${employeeId}`, employeeData);
  return response.data;
}

export const deleteEmployee = async (employeeId) => {
  const response = await api.delete(`/api/admin/employees/${employeeId}`);
  return response.data;
}

export const getAllCustomers = async () => {
  const response = await api.get("/api/admin/customers/all");
  return response.data;
}

export const getCustomerVehicles = async (customerId) => {
  const response = await api.get(`/api/admin/customers/${customerId}/vehicles`);
  return response.data;
}

export const getCustomerServices = async (customerId) => {
  const response = await api.get(`/api/admin/customers/${customerId}/services`);
  return response.data;
}

export const getServiceStatusSummary = async () => {
  const response = await api.get("/api/admin/services/status-summary");
  return response.data;
}

export const getWeeklyAppointments = async () => {
  const response = await api.get("/api/admin/appointments/weekly");
  return response.data;
}

export const getMonthlyAppointments = async () => {
  const response = await api.get("/api/admin/appointments/monthly");
  return response.data;
}

export const getAllAppointments = async () => {
  const response = await api.get("/api/admin/appointments/all");
  return response.data;
}

export const getEmployeeReport = async () => {
  const response = await api.get("/api/admin/reports/employee");
  return response.data;
}

export const getCustomerReport = async () => {
  const response = await api.get("/api/admin/reports/customer");
  return response.data;
}

export const getAppointmentReport = async () => {
  const response = await api.get("/api/admin/reports/appointment");
  return response.data;
}

// Assign employee to service request
export const assignEmployeeToService = async (serviceId, employeeId) => {
  const response = await api.post(`/api/admin/services/${serviceId}/assign-employee`, { employeeId });
  return response.data;
}