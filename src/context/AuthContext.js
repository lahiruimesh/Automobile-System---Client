import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored) {
      const userData = JSON.parse(stored);
      // Add token to user object if it exists
      if (token) {
        userData.token = token;
      }
      return userData;
    }
    return null;
  });

  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    // Store token separately for API requests
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Clear all possible auth-related items
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
