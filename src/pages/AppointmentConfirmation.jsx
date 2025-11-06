import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import "../styles/appointments.css";

export default function AppointmentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const appointment = location.state?.appointment;

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate("/appointments/my-appointments");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!appointment) {
    navigate("/appointments/book");
    return null;
  }

  return (
    <div className="appointment-booking-page pt-16">
      <div className="booking-container">
        <div className="confirmation-success">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Appointment Confirmed!</h1>
          <p className="success-subtitle">
            Your appointment has been successfully booked. Check your email for confirmation details.
          </p>

          <div className="confirmation-code">
            <span className="code-label">Confirmation Code</span>
            <span className="code-value">#{appointment.id}</span>
          </div>

          <div className="confirmation-details-summary">
            <div className="summary-item">
              <span className="summary-icon">📅</span>
              <div>
                <div className="summary-label">Date & Time</div>
                <div className="summary-value">
                  {format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="summary-subvalue">
                  {appointment.start_time.substring(0, 5)} - {appointment.end_time.substring(0, 5)}
                </div>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">🔧</span>
              <div>
                <div className="summary-label">Service</div>
                <div className="summary-value">
                  {appointment.service_type.replace(/_/g, " ").toUpperCase()}
                </div>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">🚗</span>
              <div>
                <div className="summary-label">Vehicle</div>
                <div className="summary-value">
                  {appointment.vehicle_make} {appointment.vehicle_model}
                </div>
              </div>
            </div>
          </div>

          <div className="important-info">
            <h3>📋 Important Information</h3>
            <ul>
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Bring your vehicle registration and insurance documents</li>
              <li>If you need to cancel, please do so at least 24 hours in advance</li>
              <li>You'll receive an email confirmation shortly</li>
            </ul>
          </div>

          <div className="confirmation-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/appointments/my-appointments")}
            >
              View My Appointments
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/customer")}
            >
              Return to Dashboard
            </button>
          </div>

          <p className="auto-redirect">
            You'll be redirected to your appointments in 10 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
