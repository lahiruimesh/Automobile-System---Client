import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import AdminNavbar from "../../components/adminNavbar";
import {
  getAllEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/timeLog";
import { toast } from "react-toastify";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "Employee",
    isActive: true,
    address: "",
    profile_picture: "",
    date_of_birth: "",
    emergency_contact: "",
    emergency_name: "",
    employee_certifications: "",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        console.log("Employees response:", response);
        // Handle both old and new response formats
        const employeesData = response.data || response;
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const employeeData = {
        full_name: newEmployee.full_name,
        email: newEmployee.email,
        password: newEmployee.password,
        phone: newEmployee.phone,
        role: "Employee",
        isActive: true,
        address: newEmployee.address,
        profile_picture: newEmployee.profile_picture,
        date_of_birth: newEmployee.date_of_birth,
        emergency_contact: newEmployee.emergency_contact,
        emergency_name: newEmployee.emergency_name,
        employee_certifications: newEmployee.employee_certifications,
      };

      const updatedResponse = await getAllEmployees();
      const updatedEmployees = updatedResponse.data || updatedResponse;
      setEmployees(Array.isArray(updatedEmployees) ? updatedEmployees : []);

      setNewEmployee({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        role: "Employee",
        isActive: true,
        address: "",
        profile_picture: "",
        date_of_birth: "",
        emergency_contact: "",
        emergency_name: "",
        employee_certifications: "",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee");
    }
  };

  const handleEditEmployee = async () => {
    try {
      await updateEmployee(selectedEmployee.id, selectedEmployee);

      // Refresh employees after successful update
      const updatedResponse = await getAllEmployees();
      const updatedEmployees = updatedResponse.data || updatedResponse;
      setEmployees(Array.isArray(updatedEmployees) ? updatedEmployees : []);

      setShowEditModal(false);
      setSelectedEmployee(null);
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error("Error editing employee:", error);
      toast.error("Error editing employee");
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(selectedEmployee.id);
      setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      getAllEmployees();
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={28} /> Employee Management
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-100">
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Active</th>
                <th className="p-3">Address</th>
                <th className="p-3">DOB</th>
                <th className="p-3">Emergency Name</th>
                <th className="p-3">Emergency Contact</th>
                <th className="p-3">Certifications</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{emp.full_name}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.phone}</td>
                  <td className="p-3">{emp.isActive ? "Yes" : "No"}</td>
                  <td className="p-3">{emp.address}</td>
                  <td className="p-3">{emp.date_of_birth}</td>
                  <td className="p-3">{emp.emergency_name}</td>
                  <td className="p-3">{emp.emergency_contact}</td>
                  <td className="p-3">{emp.employee_certifications}</td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <Modal
          title="Edit Employee"
          key={`editModal-${selectedEmployee.id}`}
          employee={selectedEmployee}
          setEmployee={setSelectedEmployee}
          onSave={handleEditEmployee}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to delete{" "}
              <span className="text-red-600">{selectedEmployee.full_name}</span>{" "}
              from the list?
            </h2>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleDeleteEmployee}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Modal({ title, employee, setEmployee, onSave, onClose }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            ["Full Name", "full_name", "text"],
            ["Email", "email", "email"],
            ...(title === "Add New Employee"
              ? [["Password", "password", "password"]]
              : []),
            ["Phone", "phone", "text"],
            ["Address", "address", "text"],
            ["Date of Birth", "date_of_birth", "date"],
            ["Emergency Name", "emergency_name", "text"],
            ["Emergency Contact", "emergency_contact", "text"],
            ["Certifications", "employee_certifications", "text"],
          ].map(([label, name, type]) => (
            <div key={name} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={employee[name] || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
