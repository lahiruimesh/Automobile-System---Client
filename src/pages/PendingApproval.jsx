import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PendingApproval() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your account is pending approval</h2>
      <p>Please wait until the Super Admin approves your account.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
