import { useState } from "react";
import { createServiceRequest } from "../api/serviceRequests";

export default function ServiceRequestForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    vehicleInfo: {
      make: "",
      model: "",
      year: ""
    }
  });
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    "Oil Change",
    "Brake Service",
    "Tire Rotation",
    "Engine Repair",
    "Transmission Service",
    "Battery Replacement",
    "Air Conditioning",
    "General Inspection"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Creating service request with data:", formData);
      const response = await createServiceRequest(formData);
      console.log("Service request created:", response);
      alert("Service request created successfully!");
      setFormData({
        serviceType: "",
        description: "",
        vehicleInfo: { make: "", model: "", year: "" }
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create service request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">New Service Request</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select
            value={formData.serviceType}
            onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Service</option>
            {serviceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Make</label>
          <input
            type="text"
            value={formData.vehicleInfo.make}
            onChange={(e) => setFormData({
              ...formData,
              vehicleInfo: {...formData.vehicleInfo, make: e.target.value}
            })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Model</label>
          <input
            type="text"
            value={formData.vehicleInfo.model}
            onChange={(e) => setFormData({
              ...formData,
              vehicleInfo: {...formData.vehicleInfo, model: e.target.value}
            })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Year</label>
          <input
            type="number"
            value={formData.vehicleInfo.year}
            onChange={(e) => setFormData({
              ...formData,
              vehicleInfo: {...formData.vehicleInfo, year: e.target.value}
            })}
            className="w-full p-2 border rounded-md"
            min="1900"
            max="2025"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full p-2 border rounded-md h-24"
          placeholder="Describe the issue or service needed..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}