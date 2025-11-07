import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { getMyAppointments } from "../api/appointments";
import { useSocket } from "../context/SocketContext";
import {
  FiCheckCircle,
  FiClock,
  FiTool,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";
import "../styles/trackProgress.css";

const STATUS_CONFIG = {
  pending: {
    icon: FiClock,
    color: "#f59e0b",
    bg: "#fef3c7",
    label: "Pending Confirmation",
    description: "Your appointment is awaiting confirmation from our team",
    step: 1,
  },
  confirmed: {
    icon: FiCheckCircle,
    color: "#3b82f6",
    bg: "#dbeafe",
    label: "Confirmed",
    description: "Your appointment has been confirmed and scheduled",
    step: 2,
  },
  in_progress: {
    icon: FiTool,
    color: "#6366f1",
    bg: "#e0e7ff",
    label: "Service In Progress",
    description: "Our technician is currently working on your vehicle",
    step: 3,
  },
  completed: {
    icon: FiCheckCircle,
    color: "#10b981",
    bg: "#d1fae5",
    label: "Service Completed",
    description: "Your vehicle service has been completed successfully",
    step: 4,
  },
  cancelled: {
    icon: FiXCircle,
    color: "#ef4444",
    bg: "#fee2e2",
    label: "Cancelled",
    description: "This appointment has been cancelled",
    step: 0,
  },
};

export default function TrackProgress() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await getMyAppointments();
      const allAppointments = response.data.appointments;
      
      // Filter active appointments (not completed or cancelled)
      const activeAppointments = allAppointments.filter(
        (apt) => !["completed", "cancelled"].includes(apt.status)
      );
      
      setAppointments(activeAppointments);
      
      // Auto-select the first active appointment
      if (activeAppointments.length > 0 && !selectedAppointment) {
        setSelectedAppointment(activeAppointments[0]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("appointmentUpdate", (data) => {
        console.log("Appointment status updated:", data);
        fetchAppointments();
      });

      socket.on("slotUpdate", () => {
        fetchAppointments();
      });
    }

    return () => {
      if (socket) {
        socket.off("appointmentUpdate");
        socket.off("slotUpdate");
      }
    };
  }, [socket, fetchAppointments]);

  const getProgressPercentage = (status) => {
    const steps = {
      pending: 25,
      confirmed: 50,
      in_progress: 75,
      completed: 100,
      cancelled: 0,
    };
    return steps[status] || 0;
  };

  const renderTimeline = (status) => {
    const currentStep = STATUS_CONFIG[status]?.step || 0;
    const steps = [
      { name: "Pending", step: 1 },
      { name: "Confirmed", step: 2 },
      { name: "In Progress", step: 3 },
      { name: "Completed", step: 4 },
    ];

    return (
      <div className="timeline-container">
        {steps.map((item, index) => {
          const isActive = currentStep >= item.step;
          const isCurrent = currentStep === item.step;

          return (
            <div key={item.step} className="timeline-step">
              <div className={`timeline-node ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}>
                {isActive ? <FiCheckCircle size={24} /> : <div className="timeline-dot" />}
              </div>
              <div className="timeline-label">{item.name}</div>
              {index < steps.length - 1 && (
                <div className={`timeline-line ${isActive ? "active" : ""}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="track-progress-container pt-16">
        <div className="loading-spinner">
          <FiRefreshCw className="spin" size={48} />
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="track-progress-container pt-16">
        <div className="empty-state">
          <FiAlertCircle size={64} className="empty-icon" />
          <h2>No Active Appointments</h2>
          <p>You don't have any active appointments to track.</p>
          <button className="btn-primary" onClick={() => navigate("/appointments/book")}>
            Book an Appointment
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[selectedAppointment?.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="track-progress-container pt-16">
      {/* Header */}
      <div className="track-header">
        <button className="back-button" onClick={() => navigate("/customer")}>
          <FiArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="header-actions">
          <button 
            className="refresh-button" 
            onClick={fetchAppointments}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? "spin" : ""} size={20} />
            Refresh
          </button>
        </div>
      </div>

      <div className="track-content">
        {/* Appointment Selector */}
        {appointments.length > 1 && (
          <div className="appointment-selector">
            <h3>Select Appointment to Track</h3>
            <div className="appointment-cards">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`selector-card ${selectedAppointment?.id === apt.id ? "selected" : ""}`}
                  onClick={() => setSelectedAppointment(apt)}
                >
                  <div className="card-header">
                    <span className="appointment-id">#{apt.id}</span>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: STATUS_CONFIG[apt.status]?.bg,
                        color: STATUS_CONFIG[apt.status]?.color 
                      }}
                    >
                      {STATUS_CONFIG[apt.status]?.label}
                    </span>
                  </div>
                  <div className="card-info">
                    <p className="vehicle-info">
                      {apt.vehicle_make} {apt.vehicle_model}
                    </p>
                    <p className="date-info">
                      {apt.date && format(new Date(apt.date), "MMM d, yyyy")} at {apt.start_time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Tracking View */}
        <div className="tracking-main">
          {/* Current Status Card */}
          <div className="status-card" style={{ borderLeftColor: statusInfo.color }}>
            <div className="status-icon" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
              <StatusIcon size={48} />
            </div>
            <div className="status-content">
              <h2 className="status-title">{statusInfo.label}</h2>
              <p className="status-description">{statusInfo.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          {selectedAppointment?.status !== "cancelled" && (
            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span className="progress-percentage">{getProgressPercentage(selectedAppointment?.status)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${getProgressPercentage(selectedAppointment?.status)}%`,
                    backgroundColor: statusInfo.color 
                  }}
                />
              </div>
            </div>
          )}

          {/* Timeline */}
          {selectedAppointment?.status !== "cancelled" && renderTimeline(selectedAppointment?.status)}

          {/* Appointment Details */}
          <div className="details-section">
            <h3>Appointment Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Appointment ID</span>
                <span className="detail-value">#{selectedAppointment?.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Service Type</span>
                <span className="detail-value">
                  {selectedAppointment?.service_type?.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {selectedAppointment?.vehicle_make} {selectedAppointment?.vehicle_model} ({selectedAppointment?.vehicle_year})
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">License Plate</span>
                <span className="detail-value">{selectedAppointment?.license_plate || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Scheduled Date</span>
                <span className="detail-value">
                  {selectedAppointment?.date && format(new Date(selectedAppointment.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Time Slot</span>
                <span className="detail-value">
                  {selectedAppointment?.start_time} - {selectedAppointment?.end_time}
                </span>
              </div>
            </div>

            {selectedAppointment?.notes && (
              <div className="notes-section">
                <span className="detail-label">Notes</span>
                <p className="notes-content">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>

          {/* Estimated Completion */}
          {selectedAppointment?.status === "in_progress" && (
            <div className="info-banner">
              <FiTool size={24} />
              <div>
                <strong>Service In Progress</strong>
                <p>Our technician is working on your vehicle. You'll be notified when it's ready.</p>
              </div>
            </div>
          )}

          {selectedAppointment?.status === "confirmed" && (
            <div className="info-banner confirmed">
              <FiCheckCircle size={24} />
              <div>
                <strong>Appointment Confirmed</strong>
                <p>Please arrive 10 minutes before your scheduled time.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

