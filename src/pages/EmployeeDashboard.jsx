import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getMyAssignments,
  getMyTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  getWeeklyReport,
  getMonthlyReport,
  updateServiceStatus,
} from "../api/timeLog";
import TimeLogForm from "../components/TimeLogForm";
import TimeEntryCard from "../components/TimeEntryCard";
import TimeReportChart from "../components/TimeReportChart";
import ServiceDetailsModal from "../components/ServiceDetailsModal";
import NotificationBell from "../components/NotificationBell";
import CalendarView from "../components/CalendarView";
import {
  FiLogOut,
  FiClock,
  FiClipboard,
  FiBarChart2,
  FiPlus,
  FiRefreshCw,
  FiCheckSquare,
  FiAlertCircle,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState("assignments"); // assignments, timeLogs, reports, calendar
  const [assignments, setAssignments] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingTimeLog, setEditingTimeLog] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchAssignments();
    fetchTimeLogs();
  }, []);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  // API Calls
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getMyAssignments();
      setAssignments(data.assignments || []);
    } catch (error) {
      showNotification("Failed to load assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeLogs = async () => {
    try {
      setLoading(true);
      const data = await getMyTimeLogs();
      setTimeLogs(data.timeLogs || []);
    } catch (error) {
      showNotification("Failed to load time logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const weekly = await getWeeklyReport();
      const monthly = await getMonthlyReport();
      setWeeklyReport(weekly);
      setMonthlyReport(monthly);
    } catch (error) {
      showNotification("Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeLog = async (formData) => {
    try {
      await createTimeLog(formData);
      showNotification("Time log created successfully!", "success");
      setShowTimeLogForm(false);
      setSelectedAssignment(null);
      fetchTimeLogs();
      fetchAssignments();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to create time log",
        "error"
      );
    }
  };

  const handleUpdateTimeLog = async (formData) => {
    try {
      await updateTimeLog(editingTimeLog.id, formData);
      showNotification("Time log updated successfully!", "success");
      setEditingTimeLog(null);
      setShowTimeLogForm(false);
      fetchTimeLogs();
      fetchAssignments();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to update time log",
        "error"
      );
    }
  };

  const handleDeleteTimeLog = async (timeLogId) => {
    if (!window.confirm("Are you sure you want to delete this time log?")) return;

    try {
      await deleteTimeLog(timeLogId);
      showNotification("Time log deleted successfully!", "success");
      fetchTimeLogs();
      fetchAssignments();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to delete time log",
        "error"
      );
    }
  };

  const handleStatusUpdate = async (serviceId, newStatus) => {
    try {
      await updateServiceStatus(serviceId, newStatus);
      showNotification("Service status updated!", "success");
      fetchAssignments();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to update status",
        "error"
      );
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openTimeLogForm = (assignment) => {
    setSelectedAssignment(assignment);
    setEditingTimeLog(null);
    setShowTimeLogForm(true);
  };

  const openEditTimeLogForm = (timeLog) => {
    setEditingTimeLog(timeLog);
    setSelectedAssignment(null);
    setShowTimeLogForm(true);
  };

  const closeTimeLogForm = () => {
    setShowTimeLogForm(false);
    setSelectedAssignment(null);
    setEditingTimeLog(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 font-bold";
      case "high":
        return "text-orange-600 font-semibold";
      case "normal":
        return "text-gray-600";
      case "low":
        return "text-gray-400";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Employee Dashboard</h1>
              <p className="text-sky-100 mt-1">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <button
                onClick={() => navigate('/employee/profile')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium"
              >
                <FiUser />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          } text-white animate-slide-in`}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("assignments")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "assignments"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiClipboard size={20} />
              My Assignments
            </button>
            <button
              onClick={() => setActiveTab("timeLogs")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "timeLogs"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiClock size={20} />
              Time Logs
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "reports"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiBarChart2 size={20} />
              Reports
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-4 transition ${
                activeTab === "calendar"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiCalendar size={20} />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FiRefreshCw className="animate-spin text-sky-500" size={32} />
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Active Assignments ({assignments.length})
              </h2>
              <button
                onClick={fetchAssignments}
                className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition font-medium"
              >
                <FiRefreshCw />
                Refresh
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiAlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500 text-lg">No active assignments</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.assignment_id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-200 cursor-pointer"
                    onClick={() => setSelectedServiceId(assignment.service_id)}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {assignment.vehicle_number} • {assignment.vehicle_model}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            assignment.status
                          )}`}
                        >
                          {assignment.status.replace("_", " ").toUpperCase()}
                        </span>
                        <span className={`text-xs text-center ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Type:</span> {assignment.service_type}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Role:</span> {assignment.assignment_role}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Customer:</span> {assignment.customer_name}
                      </p>
                      {assignment.scheduled_date && (
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Scheduled:</span>{" "}
                          {new Date(assignment.scheduled_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    {assignment.description && (
                      <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
                    )}

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Hours Logged</span>
                        <span className="font-semibold text-sky-600">
                          {parseFloat(assignment.total_hours_logged || 0).toFixed(1)} /{" "}
                          {assignment.estimated_hours || "?"} hrs
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-sky-600 h-2 rounded-full transition-all"
                          style={{
                            width: assignment.estimated_hours
                              ? `${Math.min(
                                  (assignment.total_hours_logged / assignment.estimated_hours) *
                                    100,
                                  100
                                )}%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTimeLogForm(assignment);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium"
                      >
                        <FiPlus />
                        Log Time
                      </button>
                      <select
                        value={assignment.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(assignment.service_id, e.target.value);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Time Logs Tab */}
        {activeTab === "timeLogs" && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                My Time Logs ({timeLogs.length})
              </h2>
              <button
                onClick={fetchTimeLogs}
                className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition font-medium"
              >
                <FiRefreshCw />
                Refresh
              </button>
            </div>

            {timeLogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiClock className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500 text-lg mb-4">No time logs yet</p>
                <button
                  onClick={() => setActiveTab("assignments")}
                  className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium"
                >
                  Go to Assignments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {timeLogs.map((timeLog) => (
                  <TimeEntryCard
                    key={timeLog.id}
                    timeLog={timeLog}
                    onEdit={openEditTimeLogForm}
                    onDelete={handleDeleteTimeLog}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Time Reports</h2>
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition font-medium"
              >
                <FiRefreshCw />
                Refresh
              </button>
            </div>

            <TimeReportChart weeklyData={weeklyReport} monthlyData={monthlyReport} />
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === "calendar" && !loading && (
          <CalendarView />
        )}
      </div>

      {/* Time Log Form Modal */}
      {showTimeLogForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <TimeLogForm
                assignment={selectedAssignment}
                initialData={editingTimeLog}
                onSubmit={editingTimeLog ? handleUpdateTimeLog : handleCreateTimeLog}
                onCancel={closeTimeLogForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedServiceId && (
        <ServiceDetailsModal
          serviceId={selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
        />
      )}
    </div>
  );
}

