import React from "react";
import { FiClock, FiEdit2, FiTrash2, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";

export default function TimeEntryCard({ timeLog, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "submitted":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="inline mr-1" />;
      case "rejected":
        return <FiXCircle className="inline mr-1" />;
      case "submitted":
        return <FiAlertCircle className="inline mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const canEdit = timeLog.status === "submitted" || timeLog.status === "rejected";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-800 mb-1">
            {timeLog.service_title || "Service"}
          </h4>
          <p className="text-sm text-gray-500">
            {timeLog.vehicle_number} • {timeLog.service_type}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(timeLog.status)}`}>
          {getStatusIcon(timeLog.status)}
          {timeLog.status.toUpperCase()}
        </div>
      </div>

      {/* Date and Time */}
      <div className="mb-3 p-3 bg-sky-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <FiClock className="mr-2 text-sky-600" />
          <span className="font-medium">{formatDate(timeLog.log_date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="ml-6">
            {formatTime(timeLog.start_time)} - {formatTime(timeLog.end_time)}
          </span>
          <span className="ml-auto font-bold text-sky-600 text-lg">
            {parseFloat(timeLog.hours_worked).toFixed(2)} hrs
          </span>
        </div>
      </div>

      {/* Work Description */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Work Description:</p>
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {timeLog.work_description}
        </p>
      </div>

      {/* Notes (if any) */}
      {timeLog.notes && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
          <p className="text-sm text-gray-600 italic">{timeLog.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      {canEdit && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(timeLog)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium"
          >
            <FiEdit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(timeLog.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            <FiTrash2 size={16} />
            Delete
          </button>
        </div>
      )}

      {timeLog.status === "approved" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-green-600 font-medium">
            ✓ This time log has been approved and cannot be edited
          </p>
        </div>
      )}

      {/* Footer - Created/Updated timestamp */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          Logged on {new Date(timeLog.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
