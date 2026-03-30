import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";
  const adminToken = localStorage.getItem("adminToken");

  const isAuthenticated = isAdminAuthenticated && Boolean(adminToken);

  if (!isAuthenticated) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminToken");
  }

  return isAuthenticated
    ? children
    : React.createElement(Navigate, { to: "/login", replace: true });
};

export default ProtectedRoute;