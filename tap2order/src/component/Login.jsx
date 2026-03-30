import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      toast.error("Username and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const apiBase = (import.meta.env.VITE_API_URL || "").trim();
      const loginUrl = apiBase
        ? `${apiBase}/api/auth/login`
        : import.meta.env.DEV
        ? "/api/auth/login"
        : "http://localhost:8001/api/auth/login";

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          username: trimmedUsername,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdminAuthenticated", "true");
      if (data?.token) {
        localStorage.setItem("adminToken", data.token);
      }

      toast.success("Login successful!");
      navigate("/admin");
    } catch (error) {
      const message =
        error?.name === "TypeError"
          ? "Unable to reach server. Check backend is running and CORS/API URL settings."
          : error.message || "Unable to login.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.loginCard}>
        <h2 style={styles.heading}> GD Cafe Admin Login</h2>
        <p style={styles.subHeading}>Use your admin credentials to continue</p>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name (optional):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter your username"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styling for the login page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "Inter, Poppins, Segoe UI, Arial, sans-serif",
  },
  loginCard: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "14px",
    boxShadow: "0 14px 40px rgba(2, 6, 23, 0.35)",
    width: "100%",
    maxWidth: "440px",
    textAlign: "center",
    border: "1px solid #dbeafe",
  },
  heading: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "0.4px",
    color: "#0f172a",
  },
  subHeading: {
    fontSize: "15px",
    marginBottom: "22px",
    color: "#334155",
    fontWeight: "500",
  },
  formGroup: {
    marginBottom: "16px",
    textAlign: "left",
    width: "100%",
  },
  label: {
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "700",
    marginBottom: "6px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "10px",
    border: "1.5px solid #94a3b8",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "500",
    marginTop: "5px",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputFocus: {
    borderColor: "#2563eb",
  },
  button: {
    padding: "13px 20px",
    background: "linear-gradient(90deg, #ea580c 0%, #f97316 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    fontSize: "17px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    boxShadow: "0 8px 20px rgba(249, 115, 22, 0.35)",
    transition: "transform 0.15s ease, filter 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#c2410c",
  },
};

export default Login;