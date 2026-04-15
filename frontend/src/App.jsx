import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/DetailBlog";
import MyBlogs from "./pages/MyBlogs";
import EditBlog from "./pages/EditBlog";

// Admin Pages
import Dashboard from "./adminpages/Dashboard";
import Users from "./adminpages/Users";
import Blogs from "./adminpages/Blogs";

// Routes
import {
  ProtectedRoute,
  UserRoute,
  AdminRoute,
  PublicRoute,
} from "./protected/ProtectedRoutes";

function App() {
  const { isAuth, user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={
            isAuth
              ? user?.role === "admin"
                ? <Navigate to="/admin/dashboard" />
                : <Navigate to="/home" />
              : <Navigate to="/login" />
          }
        />

        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* USER */}
        <Route
          path="/home"
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          }
        />

        <Route
          path="/create"
          element={
            <UserRoute>
              <CreateBlog />
            </UserRoute>
          }
        />

        <Route
          path="/myblogs"
          element={
            <UserRoute>
              <MyBlogs />
            </UserRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <UserRoute>
              <EditBlog />
            </UserRoute>
          }
        />

        {/* COMMON */}
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogDetails />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/blogs"
          element={
            <AdminRoute>
              <Blogs />
            </AdminRoute>
          }
        />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;