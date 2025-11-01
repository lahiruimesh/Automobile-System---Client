import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isToday, isPast } from "date-fns";
import {
  getAvailableSlots,
  bookAppointment,
  getMyVehicles,
  addVehicle,
} from "../api/appointments";
import { useSocket } from "../context/SocketContext";
import { theme } from "../styles/theme";
import "../styles/appointments.css";

const SERVICE_TYPES = [
  { value: "oil_change", label: "Oil Change", duration: "1 hour", icon: "🛢️" },
  { value: "tire_rotation", label: "Tire Rotation", duration: "1 hour", icon: "🔄" },
  { value: "brake_service", label: "Brake Service", duration: "2 hours", icon: "🛑" },
  { value: "engine_diagnostic", label: "Engine Diagnostic", duration: "1-2 hours", icon: "🔧" },
  { value: "transmission", label: "Transmission Service", duration: "2-3 hours", icon: "⚙️" },
  { value: "ac_service", label: "AC Service", duration: "1 hour", icon: "❄️" },
  { value: "general_maintenance", label: "General Maintenance", duration: "1-2 hours", icon: "🔍" },
  { value: "body_work", label: "Body Work", duration: "Varies", icon: "🚗" },
  { value: "detailing", label: "Detailing", duration: "2-4 hours", icon: "✨" },
  { value: "custom_modification", label: "Custom Modification", duration: "Varies", icon: "🎨" },
];

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Multi-step form state
  const [step, setStep] = useState(1); // 1: Service, 2: Vehicle, 3: DateTime, 4: Confirm

  // Form data
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");

  // Data state
  const [vehicles, setVehicles] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vehicle modal
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    license_plate: "",
    color: "",
  });

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchAvailableSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await getAvailableSlots(dateStr, selectedService.value);
      setAvailableSlots(response.data.slots);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError("Failed to load available slots");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedService]);

  // Fetch slots when date changes
  useEffect(() => {
    if (step === 3 && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, step, selectedService, fetchAvailableSlots]);

  // Listen for real-time slot updates
  useEffect(() => {
    if (socket) {
      socket.on("slotUpdate", (data) => {
        console.log("Slot update received:", data);
        if (step === 3) {
          fetchAvailableSlots();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("slotUpdate");
      }
    };
  }, [socket, step, fetchAvailableSlots]);

  const fetchVehicles = async () => {
    try {
      const response = await getMyVehicles();
      setVehicles(response.data.vehicles);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles");
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addVehicle(newVehicle);
      await fetchVehicles();
      setShowAddVehicle(false);
      setNewVehicle({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        license_plate: "",
        color: "",
      });
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        vehicle_id: selectedVehicle.id,
        slot_id: selectedSlot.id,
        service_type: selectedService.value,
        notes: notes.trim() || null,
      };

      const response = await bookAppointment(appointmentData);
      
      // Navigate to confirmation page with appointment details
      navigate("/appointments/confirmation", {
        state: { appointment: response.data.appointment },
      });
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const tileDisabled = ({ date }) => {
    return isPast(date) && !isToday(date);
  };

  const renderStep1 = () => (
    <div className="appointment-step">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.gray800 }}>
        Select a Service
      </h2>
      
      <div className="service-grid">
        {SERVICE_TYPES.map((service) => (
          <div
            key={service.value}
            className={`service-card ${selectedService?.value === service.value ? "selected" : ""}`}
            onClick={() => setSelectedService(service)}
          >
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.label}</h3>
            <p className="service-duration">{service.duration}</p>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button
          className="btn-primary"
          disabled={!selectedService}
          onClick={() => setStep(2)}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="appointment-step">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.gray800 }}>
        Select Your Vehicle
      </h2>

      {vehicles.length === 0 ? (
        <div className="no-vehicles">
          <p>You haven't added any vehicles yet.</p>
          <button className="btn-primary" onClick={() => setShowAddVehicle(true)}>
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? "selected" : ""}`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="vehicle-icon">🚗</div>
                <h3 className="vehicle-title">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="vehicle-details">
                  {vehicle.year} • {vehicle.color || "N/A"}
                </p>
                {vehicle.license_plate && (
                  <p className="vehicle-plate">{vehicle.license_plate}</p>
                )}
              </div>
            ))}
          </div>

          <button
            className="btn-secondary mt-4"
            onClick={() => setShowAddVehicle(true)}
          >
            + Add Another Vehicle
          </button>
        </>
      )}

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep(1)}>
          Back
        </button>
        <button
          className="btn-primary"
          disabled={!selectedVehicle}
          onClick={() => setStep(3)}
        >
          Continue
        </button>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="modal-overlay" onClick={() => setShowAddVehicle(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle}>
              <div className="form-row">
                <div className="form-group">
                  <label>Make *</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year *</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>VIN (17 characters)</label>
                  <input
                    type="text"
                    maxLength="17"
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>License Plate</label>
                  <input
                    type="text"
                    maxLength="20"
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddVehicle(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Adding..." : "Add Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="appointment-step">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.gray800 }}>
        Choose Date & Time
      </h2>

      <div className="datetime-container">
        <div className="calendar-section">
          <h3 className="section-title">Select Date</h3>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileDisabled={tileDisabled}
            minDate={new Date()}
            className="custom-calendar"
          />
        </div>

        <div className="slots-section">
          <h3 className="section-title">
            Available Times for {format(selectedDate, "MMMM d, yyyy")}
          </h3>

          {loading ? (
            <div className="loading-spinner">Loading available slots...</div>
          ) : availableSlots.length === 0 ? (
            <div className="no-slots">
              <p>No available slots for this date.</p>
              <p className="text-sm">Please select another date.</p>
            </div>
          ) : (
            <div className="slots-grid">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`slot-button ${selectedSlot?.id === slot.id ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep(2)}>
          Back
        </button>
        <button
          className="btn-primary"
          disabled={!selectedSlot}
          onClick={() => setStep(4)}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="appointment-step">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.gray800 }}>
        Confirm Your Appointment
      </h2>

      <div className="confirmation-details">
        <div className="detail-card">
          <h3>Service</h3>
          <p className="detail-value">
            {selectedService.icon} {selectedService.label}
          </p>
        </div>

        <div className="detail-card">
          <h3>Vehicle</h3>
          <p className="detail-value">
            {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
          </p>
          {selectedVehicle.license_plate && (
            <p className="detail-subtitle">{selectedVehicle.license_plate}</p>
          )}
        </div>

        <div className="detail-card">
          <h3>Date & Time</h3>
          <p className="detail-value">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
          <p className="detail-subtitle">
            {selectedSlot.start_time.substring(0, 5)} - {selectedSlot.end_time.substring(0, 5)}
          </p>
        </div>

        <div className="detail-card full-width">
          <h3>Additional Notes (Optional)</h3>
          <textarea
            className="notes-textarea"
            placeholder="Any specific concerns or requests?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            maxLength="500"
          />
          <p className="char-count">{notes.length}/500</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep(3)}>
          Back
        </button>
        <button
          className="btn-primary"
          onClick={handleBookAppointment}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="appointment-booking-page">
      <div className="booking-container">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`progress-step ${step >= num ? "active" : ""} ${step === num ? "current" : ""}`}
            >
              <div className="progress-circle">{num}</div>
              <span className="progress-label">
                {num === 1 && "Service"}
                {num === 2 && "Vehicle"}
                {num === 3 && "Date & Time"}
                {num === 4 && "Confirm"}
              </span>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && step !== 4 && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
}
