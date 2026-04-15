import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// 🔐 Login required (common)
export const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AuthContext);
  return isAuth ? children : <Navigate to="/login" />;
};

// 👤 Only User
export const UserRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user?.role === "user" ? children : <Navigate to="/login" />;
};

// 👑 Only Admin
export const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user?.role === "admin" ? children : <Navigate to="/login" />;
};

// ❌ Public routes (login/register)
export const PublicRoute = ({ children }) => {
  const { isAuth, user } = useContext(AuthContext);

  if (!isAuth) return children;

  return user?.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/home" />;
};