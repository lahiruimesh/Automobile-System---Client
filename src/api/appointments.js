import axios from "axios";

const API = "http://localhost:5001/api/appointments";

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get available time slots for a specific date
 */
export const getAvailableSlots = (date, serviceType = null) => {
  const params = { date };
  if (serviceType) params.service_type = serviceType;
  
  return axios.get(`${API}/slots`, {
    headers: getAuthHeader(),
    params,
  });
};

/**
 * Book a new appointment
 */
export const bookAppointment = (appointmentData) => {
  return axios.post(API, appointmentData, {
    headers: getAuthHeader(),
  });
};

/**
 * Get user's appointments
 */
export const getMyAppointments = (status = null) => {
  const params = status ? { status } : {};
  
  return axios.get(API, {
    headers: getAuthHeader(),
    params,
  });
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = (appointmentId, reason) => {
  return axios.patch(
    `${API}/${appointmentId}/cancel`,
    { reason },
    { headers: getAuthHeader() }
  );
};

/**
 * Get upcoming appointments (for employees)
 */
export const getUpcomingAppointments = () => {
  return axios.get(`${API}/upcoming`, {
    headers: getAuthHeader(),
  });
};

/**
 * Update appointment status (for employees/admins)
 */
export const updateAppointmentStatus = (appointmentId, status) => {
  return axios.patch(
    `${API}/${appointmentId}/status`,
    { status },
    { headers: getAuthHeader() }
  );
};

/**
 * Get user's vehicles
 */
export const getMyVehicles = () => {
  return axios.get(`${API}/vehicles`, {
    headers: getAuthHeader(),
  });
};

/**
 * Add a new vehicle
 */
export const addVehicle = (vehicleData) => {
  return axios.post(`${API}/vehicles`, vehicleData, {
    headers: getAuthHeader(),
  });
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = (vehicleId) => {
  return axios.delete(`${API}/vehicles/${vehicleId}`, {
    headers: getAuthHeader(),
  });
};

/**
 * Request appointment modification (Customer)
 */
export const requestAppointmentModification = (appointmentId, newSlotId, reason) => {
  return axios.post(
    `http://localhost:5001/api/admin/appointments/${appointmentId}/request-modification`,
    { newSlotId, reason },
    { headers: getAuthHeader() }
  );
};

/**
 * Get customer's modification requests
 */
export const getMyModificationRequests = () => {
  return axios.get(`http://localhost:5001/api/admin/modifications/my-requests`, {
    headers: getAuthHeader(),
  });
};

/**
 * Get all modification requests (Employee/Admin)
 */
export const getModificationRequests = () => {
  return axios.get(`http://localhost:5001/api/admin/modifications`, {
    headers: getAuthHeader(),
  });
};

/**
 * Approve modification request (Employee/Admin)
 */
export const approveModificationRequest = (modificationId) => {
  return axios.put(
    `http://localhost:5001/api/admin/modifications/${modificationId}/approve`,
    {},
    { headers: getAuthHeader() }
  );
};

/**
 * Reject modification request (Employee/Admin)
 */
export const rejectModificationRequest = (modificationId, rejectionReason) => {
  return axios.put(
    `http://localhost:5001/api/admin/modifications/${modificationId}/reject`,
    { rejectionReason },
    { headers: getAuthHeader() }
  );
};
