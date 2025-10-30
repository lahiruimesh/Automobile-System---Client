import React, { useState } from "react";

export default function TimeLogForm({ assignment, onSubmit, onCancel, initialData = null }) {
  const today = new Date().toISOString().split("T")[0];
  
  const [formData, setFormData] = useState({
    service_id: initialData?.service_id || assignment?.service_id || "",
    assignment_id: initialData?.assignment_id || assignment?.assignment_id || "",
    log_date: initialData?.log_date || today,
    start_time: initialData?.start_time || "09:00",
    end_time: initialData?.end_time || "17:00",
    work_description: initialData?.work_description || "",
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.log_date) newErrors.log_date = "Date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.work_description?.trim())
      newErrors.work_description = "Work description is required";

    // Validate time range
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      if (end <= start) {
        newErrors.end_time = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateHours = () => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      const hours = (end - start) / (1000 * 60 * 60);
      return hours > 0 ? hours.toFixed(2) : "0.00";
    }
    return "0.00";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? "Edit Time Log" : "Add Time Log"}
      </h3>

      {assignment && (
        <div className="mb-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Service:</span> {assignment.title}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Vehicle:</span> {assignment.vehicle_number} ({assignment.vehicle_model})
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="log_date"
            value={formData.log_date}
            onChange={handleChange}
            max={today}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.log_date ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-sky-400`}
          />
          {errors.log_date && (
            <p className="text-red-500 text-sm mt-1">{errors.log_date}</p>
          )}
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.start_time ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-400`}
            />
            {errors.start_time && (
              <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.end_time ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-400`}
            />
            {errors.end_time && (
              <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
            )}
          </div>
        </div>

        {/* Hours Calculated */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Hours to be logged:</span>{" "}
            <span className="text-sky-600 font-bold text-lg">
              {calculateHours()} hours
            </span>
          </p>
        </div>

        {/* Work Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="work_description"
            value={formData.work_description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the work performed..."
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.work_description ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-sky-400`}
          />
          {errors.work_description && (
            <p className="text-red-500 text-sm mt-1">{errors.work_description}</p>
          )}
        </div>

        {/* Notes (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Any additional notes..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg bg-sky-500 text-white font-semibold shadow-lg hover:bg-sky-600 transition"
          >
            {initialData ? "Update Time Log" : "Submit Time Log"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
