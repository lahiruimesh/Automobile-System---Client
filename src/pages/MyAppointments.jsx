import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  getMyAppointments,
  cancelAppointment,
  requestAppointmentModification,
  getAvailableSlots,
} from "../api/appointments";
import { useSocket } from "../context/SocketContext";
import "../styles/appointments.css";

const STATUS_COLORS = {
  pending: { bg: "#fef3c7", text: "#f59e0b", label: "Pending" },
  confirmed: { bg: "#dbeafe", text: "#3b82f6", label: "Confirmed" },
  in_progress: { bg: "#e0e7ff", text: "#6366f1", label: "In Progress" },
  completed: { bg: "#d1fae5", text: "#10b981", label: "Completed" },
  cancelled: { bg: "#fee2e2", text: "#ef4444", label: "Cancelled" },
};

export default function MyAppointments() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, past
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Modification modal
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [modificationReason, setModificationReason] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submittingModification, setSubmittingModification] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("appointmentUpdate", () => {
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
  }, [socket]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyAppointments();
      setAppointments(response.data.appointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancellationReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setCancelling(true);

    try {
      await cancelAppointment(selectedAppointment.id, cancellationReason);
      setShowCancelModal(false);
      setCancellationReason("");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancelling(false);
    }
  };

  const handleModificationClick = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowModificationModal(true);
    setLoadingSlots(true);

    try {
      // Fetch available slots for the appointment date
      const response = await getAvailableSlots(appointment.date);
      setAvailableSlots(response.data.slots || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      alert("Failed to load available time slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleModificationSubmit = async () => {
    if (!selectedNewSlot) {
      alert("Please select a new time slot");
      return;
    }

    if (!modificationReason.trim()) {
      alert("Please provide a reason for modification");
      return;
    }

    setSubmittingModification(true);

    try {
      console.log("Submitting modification:", {
        appointmentId: selectedAppointment.id,
        newSlotId: selectedNewSlot,
        reason: modificationReason
      });

      await requestAppointmentModification(
        selectedAppointment.id,
        selectedNewSlot,
        modificationReason
      );
      setShowModificationModal(false);
      setModificationReason("");
      setSelectedNewSlot(null);
      setSelectedAppointment(null);
      alert("Modification request submitted successfully! An employee will review it soon.");
      fetchAppointments();
    } catch (err) {
      console.error("Error submitting modification request:", err);
      console.error("Error response:", err.response);
      
      // Show detailed error message
      const errorMsg = err.response?.data?.message || err.message || "Failed to submit modification request";
      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmittingModification(false);
    }
  };

  const filterAppointments = () => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate >= now &&
            ["pending", "confirmed"].includes(apt.status)
          );
        });
      case "past":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return (
            aptDate < now ||
            ["completed", "cancelled"].includes(apt.status)
          );
        });
      default:
        return appointments;
    }
  };

  const filteredAppointments = filterAppointments();

  if (loading) {
    return (
      <div className="appointment-booking-page pt-16">
        <div className="booking-container">
          <div className="loading-spinner">Loading your appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-booking-page pt-16">
      <div className="booking-container">
        <div className="appointments-header">
          <h1 className="page-title">My Appointments</h1>
          <button
            className="btn-primary"
            onClick={() => navigate("/appointments/book")}
          >
            + Book New Appointment
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({appointments.length})
          </button>
          <button
            className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`filter-tab ${filter === "past" ? "active" : ""}`}
            onClick={() => setFilter("past")}
          >
            Past
          </button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <div className="empty-icon">📅</div>
            <h3>No Appointments Found</h3>
            <p>You don't have any {filter !== "all" ? filter : ""} appointments yet.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/appointments/book")}
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header-row">
                  <div className="appointment-id">
                    Appointment #{appointment.id}
                  </div>
                  <div
                    className="appointment-status"
                    style={{
                      background: STATUS_COLORS[appointment.status].bg,
                      color: STATUS_COLORS[appointment.status].text,
                    }}
                  >
                    {STATUS_COLORS[appointment.status].label}
                  </div>
                </div>

                <div className="appointment-details-grid">
                  <div className="appointment-detail">
                    <span className="detail-icon">📅</span>
                    <div>
                      <div className="detail-label">Date & Time</div>
                      <div className="detail-text">
                        {format(new Date(appointment.date), "MMMM d, yyyy")}
                      </div>
                      <div className="detail-subtext">
                        {appointment.start_time.substring(0, 5)} -{" "}
                        {appointment.end_time.substring(0, 5)}
                      </div>
                    </div>
                  </div>

                  <div className="appointment-detail">
                    <span className="detail-icon">🔧</span>
                    <div>
                      <div className="detail-label">Service</div>
                      <div className="detail-text">
                        {appointment.service_type.replace(/_/g, " ").toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="appointment-detail">
                    <span className="detail-icon">🚗</span>
                    <div>
                      <div className="detail-label">Vehicle</div>
                      <div className="detail-text">
                        {appointment.vehicle_make} {appointment.vehicle_model}
                      </div>
                      <div className="detail-subtext">
                        {appointment.vehicle_year}
                        {appointment.license_plate && ` • ${appointment.license_plate}`}
                      </div>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="appointment-notes">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}

                {appointment.cancellation_reason && (
                  <div className="cancellation-reason">
                    <strong>Cancellation Reason:</strong>{" "}
                    {appointment.cancellation_reason}
                  </div>
                )}

                {["pending", "confirmed"].includes(appointment.status) && (
                  <div className="appointment-actions">
                    {appointment.status === "confirmed" && (
                      <button
                        className="btn-primary"
                        onClick={() => handleModificationClick(appointment)}
                        style={{ marginRight: "10px" }}
                      >
                        Request Modification
                      </button>
                    )}
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelClick(appointment)}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div
            className="modal-overlay"
            onClick={() => !cancelling && setShowCancelModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Cancel Appointment</h3>

              <div className="cancel-warning">
                <span className="warning-icon">⚠️</span>
                <p>
                  Are you sure you want to cancel appointment #
                  {selectedAppointment?.id}?
                </p>
              </div>

              <div className="form-group">
                <label>
                  Cancellation Reason <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  className="notes-textarea"
                  placeholder="Please provide a reason for cancellation..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows="4"
                  maxLength="500"
                />
                <p className="char-count">{cancellationReason.length}/500</p>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                >
                  Keep Appointment
                </button>
                <button
                  className="btn-danger"
                  onClick={handleCancelConfirm}
                  disabled={cancelling || !cancellationReason.trim()}
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modification Request Modal */}
        {showModificationModal && (
          <div
            className="modal-overlay"
            onClick={() => !submittingModification && setShowModificationModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Request Appointment Modification</h3>

              <div className="modification-info">
                <p>
                  <strong>Current Appointment:</strong> #{selectedAppointment?.id}
                </p>
                <p>
                  <strong>Current Time:</strong>{" "}
                  {selectedAppointment?.date &&
                    format(new Date(selectedAppointment.date), "EEEE, MMMM d, yyyy")}{" "}
                  at {selectedAppointment?.start_time}
                </p>
              </div>

              <div className="form-group">
                <label>
                  Select New Time Slot <span style={{ color: "#ef4444" }}>*</span>
                </label>
                {loadingSlots ? (
                  <p>Loading available slots...</p>
                ) : availableSlots.length === 0 ? (
                  <p>No available slots found for this date</p>
                ) : (
                  <div className="slots-grid" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`slot-option ${
                          selectedNewSlot === slot.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedNewSlot(slot.id)}
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                          backgroundColor:
                            selectedNewSlot === slot.id ? "#3b82f6" : "white",
                          color: selectedNewSlot === slot.id ? "white" : "black",
                        }}
                      >
                        {slot.start_time} - {slot.end_time}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  Reason for Modification <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  className="notes-textarea"
                  placeholder="Please explain why you need to modify this appointment..."
                  value={modificationReason}
                  onChange={(e) => setModificationReason(e.target.value)}
                  rows="4"
                  maxLength="500"
                />
                <p className="char-count">{modificationReason.length}/500</p>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowModificationModal(false);
                    setSelectedNewSlot(null);
                    setModificationReason("");
                  }}
                  disabled={submittingModification}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleModificationSubmit}
                  disabled={
                    submittingModification ||
                    !selectedNewSlot ||
                    !modificationReason.trim()
                  }
                >
                  {submittingModification
                    ? "Submitting..."
                    : "Submit Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
