import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Divider,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Alert,
  CircularProgress,
  Snackbar
} from "@mui/material";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfileDrawer({ logout }) {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [token, setToken] = useState("");

  // Load initial data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const storedToken = localStorage.getItem("token") || "";
    
    setProfile({
      fullName: storedUser.fullName || "",
      email: storedUser.email || "",
      phone: storedUser.phone || ""
    });
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (open && tabValue === 0) {
      fetchUserProfile();
    }
  }, [open, tabValue]);

  const fetchUserProfile = async () => {
    try {
      if (!token) throw new Error("No authentication token found");

      setProfileLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();

      setProfile({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      showSnackbar(err.message, "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSaveProfile = async () => {
    if (!profile.fullName || !profile.email) {
      showSnackbar("Full Name and Email are required", "error");
      return;
    }

    console.log("Profile data to save:", profile);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      showSnackbar("Profile updated successfully!", "success");
      localStorage.setItem("user", JSON.stringify(profile));
      setOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      showSnackbar(err.message || "Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      showSnackbar("All password fields are required", "error");
      return;
    }
    if (password.newPassword !== password.confirmPassword) {
      showSnackbar("New password and confirmation do not match", "error");
      return;
    }

    console.log("Password data to save:", password);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password");

      showSnackbar("Password updated successfully!", "success");
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setOpen(false);
    } catch (err) {
      console.error("Error changing password:", err);
      showSnackbar(err.message || "Error changing password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => {
    setOpen(false);
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
  };

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <IconButton onClick={handleDrawerOpen}>
        <UserCircleIcon className="h-8 w-8 text-white" />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
        <Box sx={{ width: 400, p: 3 }}>
          <Typography variant="h6" gutterBottom>My Profile</Typography>
          <Divider sx={{ mb: 2 }} />

          <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} variant="fullWidth">
            <Tab label="Profile" />
            <Tab label="Change Password" />
          </Tabs>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Profile Tab */}
          {tabValue === 0 && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {profileLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TextField label="Full Name" name="fullName" value={profile.fullName} onChange={handleProfileChange} fullWidth />
                  <TextField label="Email" name="email" value={profile.email} onChange={handleProfileChange} fullWidth />
                  <TextField label="Phone" name="phone" value={profile.phone} onChange={handleProfileChange} fullWidth />
                  <Button variant="contained" color="primary" onClick={handleSaveProfile} disabled={loading} fullWidth>
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Change Password Tab */}
          {tabValue === 1 && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                name="currentPassword"
                value={password.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                name="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
              />
              <Button variant="contained" color="secondary" onClick={handleSavePassword} disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : "Update Password"}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          <Button variant="outlined" color="error" onClick={logout} fullWidth>Logout</Button>
        </Box>
      </Drawer>
    </>
  );
}
