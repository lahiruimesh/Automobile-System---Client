import { useEffect, useState } from "react";
import { getPendingEmployees, approveEmployee } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getPendingEmployees(user.token).then((res) => setEmployees(res.data));
  }, [user]);

  const approve = async (id) => {
    await approveEmployee(id, user.token);
    setEmployees(employees.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending Employees</h2>

      {employees.length === 0 ? (
        <p className="text-gray-500">No pending employees.</p>
      ) : (
        <div className="space-y-4">
          {employees.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{e.full_name}</p>
                <p className="text-gray-500 text-sm">{e.email}</p>
              </div>
              <button
                onClick={() => approve(e.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
