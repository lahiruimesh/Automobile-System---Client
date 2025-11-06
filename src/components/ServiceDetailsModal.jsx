import React, { useState, useEffect } from 'react';
import { getServiceDetails } from '../api/employeeApi';
import { useSocket } from '../context/SocketContext';
import { getRequestHistory } from '../api/serviceRequests';
import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTruck,
  FiTool,
  FiClock,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiImage,
  FiFileText,
  FiPackage,
  FiMessageSquare
} from 'react-icons/fi';

export default function ServiceDetailsModal({ serviceId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [partsRequests, setPartsRequests] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0, percentage: 0 });
  const [activeTab, setActiveTab] = useState('overview'); // overview, tasks, photos, notes, parts, history
  const [requestHistory, setRequestHistory] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // Fetch history when history tab is active or when serviceId changes while on history
  useEffect(() => {
    if (activeTab === 'history' && serviceId) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, serviceId]);

  // Socket: listen for updates to this service and update UI
  useEffect(() => {
    if (!socket || !serviceId) return;

    const handleUpdate = (payload) => {
      const { requestId, status, progress: newProgress, note, updatedAt } = payload;
      if (String(requestId) !== String(serviceId)) return;

      // Update local service state
      setService((s) => ({
        ...s,
        status: status ?? s.status,
        progress: typeof newProgress === 'number' ? newProgress : s.progress,
        updated_at: updatedAt ?? s.updated_at,
      }));

      // Update progress UI
      setProgress((p) => ({
        ...p,
        percentage: typeof newProgress === 'number' ? newProgress : p.percentage,
      }));

      // Optionally prepend to history if open
      setRequestHistory((prev) => {
        const entry = {
          id: Date.now(),
          status: status,
          progress: newProgress,
          note: note,
          created_at: updatedAt || new Date().toISOString(),
        };
        return [entry, ...prev];
      });
    };

    socket.on('serviceRequestStatusUpdate', handleUpdate);
    return () => socket.off('serviceRequestStatusUpdate', handleUpdate);
  }, [socket, serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await getServiceDetails(serviceId);
      const data = response.data;
      
      setService(data.service);
      setPhotos(data.photos || []);
      setNotes(data.notes || []);
      setTasks(data.tasks || []);
      setPartsRequests(data.partsRequests || []);
      setTimeLogs(data.timeLogs || []);
      setProgress(data.progress || { total: 0, completed: 0, percentage: 0 });
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await getRequestHistory(serviceId);
      // normalize response: accept {data: [...] } or [...]
      const hist = res && Array.isArray(res) ? res : (res.data || res.history || []);
      setRequestHistory(hist);
    } catch (error) {
      console.error('Error fetching request history:', error);
      setRequestHistory([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 font-bold';
      case 'high': return 'text-orange-600 font-semibold';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{service.title || service.service_type}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sky-100 text-sm">
                <span className="flex items-center gap-1">
                  <FiCalendar size={16} />
                  {new Date(service.created_at).toLocaleDateString()}
                </span>
                <span className={`flex items-center gap-1 ${getPriorityColor(service.priority)}`}>
                  <FiAlertCircle size={16} />
                  {service.priority} priority
                </span>
                {service.estimated_hours && (
                  <span className="flex items-center gap-1">
                    <FiClock size={16} />
                    {service.estimated_hours}h estimated
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          {tasks.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress: {progress.completed}/{progress.total} tasks</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-2 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FiTool },
              { id: 'tasks', label: 'Tasks', icon: FiCheckCircle, count: tasks.length },
              { id: 'photos', label: 'Photos', icon: FiImage, count: photos.length },
              { id: 'notes', label: 'Notes', icon: FiMessageSquare, count: notes.length },
              { id: 'parts', label: 'Parts', icon: FiPackage, count: partsRequests.length },
              { id: 'history', label: 'History', icon: FiClock, count: timeLogs.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Vehicle & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Information */}
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-5 border border-sky-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiTruck className="text-sky-600" />
                    Vehicle Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Number:</span>
                      <span className="font-semibold text-gray-800">{service.vehicle_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-semibold text-gray-800">{service.vehicle_model || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-semibold text-sky-700">{service.service_type}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiUser className="text-green-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-green-600" size={16} />
                      <span className="font-semibold">{service.customer_name || 'N/A'}</span>
                    </div>
                    {service.customer_email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="text-green-600" size={16} />
                        <span className="text-gray-700">{service.customer_email}</span>
                      </div>
                    )}
                    {service.customer_phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-green-600" size={16} />
                        <span className="text-gray-700">{service.customer_phone}</span>
                      </div>
                    )}
                    {service.customer_address && (
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-green-600" size={16} />
                        <span className="text-gray-700 text-xs">{service.customer_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {service.description && (
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FiFileText className="text-sky-600" />
                    Service Description
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{service.description}</p>
                </div>
              )}

              {/* Time Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-blue-600 text-sm font-medium mb-1">Estimated Hours</p>
                  <p className="text-2xl font-bold text-blue-700">{service.estimated_hours || 0}h</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-green-600 text-sm font-medium mb-1">Hours Logged</p>
                  <p className="text-2xl font-bold text-green-700">{parseFloat(service.total_hours_logged || 0).toFixed(1)}h</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-purple-600 text-sm font-medium mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {Math.max(0, (service.estimated_hours || 0) - (service.total_hours_logged || 0)).toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiCheckCircle size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No tasks added yet</p>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      task.is_completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        task.is_completed
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-300'
                      }`}>
                        {task.is_completed && <FiCheckCircle className="text-white" size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${task.is_completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                          {index + 1}. {task.task_name}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        {task.is_completed && task.completed_at && (
                          <p className="text-xs text-green-600 mt-2">
                            Completed by {task.completed_by_name} on {new Date(task.completed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <FiImage size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No photos uploaded yet</p>
                </div>
              ) : (
                photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.photo_url}
                        alt={photo.description || 'Service photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-lg p-3 flex flex-col justify-end">
                      <p className="text-white text-sm font-medium">{photo.photo_type}</p>
                      {photo.description && (
                        <p className="text-white/80 text-xs mt-1">{photo.description}</p>
                      )}
                      <p className="text-white/60 text-xs mt-1">
                        {new Date(photo.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiMessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No notes added yet</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className={`p-4 rounded-lg border ${
                    note.is_important
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{note.author_name}</span>
                        {note.is_important && (
                          <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                            Important
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {note.note_type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{note.note_text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Parts Tab */}
          {activeTab === 'parts' && (
            <div className="space-y-3">
              {partsRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No parts requested yet</p>
                </div>
              ) : (
                partsRequests.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{request.part_name}</p>
                        <p className="text-sm text-gray-600">Part #: {request.part_number}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-700">Qty: <strong>{request.quantity_requested}</strong></span>
                          <span className="text-gray-700">Available: <strong>{request.quantity_available}</strong></span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>Requested by {request.requested_by_name}</p>
                        <p className="text-xs">{new Date(request.requested_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {(requestHistory.length === 0 && timeLogs.length === 0) ? (
                <div className="text-center py-12 text-gray-500">
                  <FiClock size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No history available</p>
                </div>
              ) : (
                // prefer requestHistory (status/progress history) if available, otherwise fall back to timeLogs
                (requestHistory.length > 0 ? requestHistory : timeLogs).map((entry) => (
                  <div key={entry.id || entry._id || entry.created_at} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-800">{entry.employee_name || entry.author_name || entry.updated_by_name || 'System'}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.status || entry.state || entry.log_status)}`}>
                            {entry.status || entry.state || entry.log_status || entry.note_type || 'update'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{entry.note || entry.work_description || entry.message || entry.note_text || ''}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={12} />
                            {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : (entry.log_date ? new Date(entry.log_date).toLocaleDateString() : '')}
                          </span>
                          {entry.start_time && (
                            <span className="flex items-center gap-1">
                              <FiClock size={12} />
                              {entry.start_time} - {entry.end_time}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {typeof entry.hours_worked !== 'undefined' ? (
                          <p className="text-2xl font-bold text-sky-600">{entry.hours_worked}h</p>
                        ) : entry.progress !== undefined ? (
                          <p className="text-2xl font-bold text-sky-600">{entry.progress}%</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
