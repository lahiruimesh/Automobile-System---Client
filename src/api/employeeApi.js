import axios from 'axios';

const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Profile APIs
export const getMyProfile = () => api.get('/employee/profile');
export const updateMyProfile = (data) => api.put('/employee/profile', data);
export const updateProfilePicture = (photoUrl) => api.put('/employee/profile/picture', { profile_picture: photoUrl });
export const addSkill = (data) => api.post('/employee/skills', data);
export const deleteSkill = (id) => api.delete(`/employee/skills/${id}`);
export const addCertification = (data) => api.post('/employee/certifications', data);
export const deleteCertification = (id) => api.delete(`/employee/certifications/${id}`);

// Service Details APIs
export const getServiceDetails = (id) => api.get(`/services/${id}/details`);
export const uploadServicePhoto = (data) => api.post('/services/photos', data);
export const deleteServicePhoto = (id) => api.delete(`/services/photos/${id}`);
export const addServiceNote = (data) => api.post('/services/notes', data);
export const updateServiceNote = (id, data) => api.put(`/services/notes/${id}`, data);
export const deleteServiceNote = (id) => api.delete(`/services/notes/${id}`);
export const addServiceTask = (data) => api.post('/services/tasks', data);
export const toggleTaskCompletion = (id) => api.patch(`/services/tasks/${id}/toggle`);
export const deleteServiceTask = (id) => api.delete(`/services/tasks/${id}`);

// Parts APIs
export const getAvailableParts = (search = '') => {
  const params = search ? { search } : {};
  return api.get('/parts/inventory', { params });
};
export const createPartsRequest = (data) => api.post('/parts/requests', data);
export const getMyPartsRequests = (status = '') => {
  const params = status ? { status } : {};
  return api.get('/parts/requests/my', { params });
};
export const getServicePartsRequests = (serviceId) => api.get(`/parts/requests/service/${serviceId}`);

// Notification APIs
export const getMyNotifications = (unreadOnly = false) => {
  const params = unreadOnly ? { unread_only: 'true' } : {};
  return api.get('/notifications', { params });
};
export const markNotificationAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.patch('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Calendar APIs
export const getMyAvailability = (month, year) => {
  const params = month && year ? { month, year } : {};
  return api.get('/calendar/availability', { params });
};
export const setAvailability = (data) => api.post('/calendar/availability', data);
export const deleteAvailability = (date) => api.delete(`/calendar/availability/${date}`);
export const getScheduledServices = (month, year) => {
  const params = month && year ? { month, year } : {};
  return api.get('/calendar/scheduled-services', { params });
};

export default api;
