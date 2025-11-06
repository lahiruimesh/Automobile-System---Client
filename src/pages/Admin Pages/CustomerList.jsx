import { useEffect, useState } from "react";
import { UserCircle, X } from "lucide-react";
import AdminNavbar from "../../components/adminNavbar";
import {
  getAllCustomers,
  getCustomerVehicles,
  getCustomerServices,
} from "../../api/timeLog";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟢 Fetch all customers on page load
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Open Vehicle Modal
  const openVehicleModal = async (customer) => {
    setSelectedCustomer(customer);
    setVehicleModalVisible(true);
    try {
      setLoading(true);
      const data = await getCustomerVehicles(customer.id);
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open Service History Modal
  const openServiceModal = async (customer) => {
    setSelectedCustomer(customer);
    setServiceModalVisible(true);
    try {
      setLoading(true);
      const data = await getCustomerServices(customer.id);
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <UserCircle size={28} /> Customer List
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-sky-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Registered Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{c.full_name}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.address}</td>
                    <td className="p-3">
                      {new Date(c.registered_date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 text-sm"
                        onClick={() => openVehicleModal(c)}
                      >
                        View Vehicles
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                        onClick={() => openServiceModal(c)}
                      >
                        View Service History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Vehicle Details Modal */}
        {vehicleModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Vehicle Details - {selectedCustomer?.full_name || ""}
                </h2>
                <button
                  onClick={() => setVehicleModalVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                </div>
              ) : vehicles.length > 0 ? (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-sky-100">
                      <th className="p-3">Plate No</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Model</th>
                      <th className="p-3">Color</th>
                      <th className="p-3">Registered Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{v.license_plate}</td>
                        <td className="p-3">{v.make}</td>
                        <td className="p-3">{v.model}</td>
                        <td className="p-3">{v.color}</td>
                        <td className="p-3">{v.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No vehicles found.</p>
              )}
            </div>
          </div>
        )}

        {/* Service History Modal */}
        {serviceModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Service History - {selectedCustomer?.full_name || ""}
                </h2>
                <button
                  onClick={() => setServiceModalVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                </div>
              ) : services.length > 0 ? (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-sky-100">
                      <th className="p-3">Service ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Service Type</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{s.id}</td>
                        <td className="p-3">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">{s.service_type}</td>
                        <td className="p-3">{s.description}</td>
                        <td className="p-3">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">
                  No service history found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
