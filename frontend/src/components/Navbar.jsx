import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuth, setIsAuth, user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await API.post("users/logout");

    setIsAuth(false);
    setUser(null);
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">

      <h1 className="text-2xl font-bold text-purple-600">
        MyBlog
      </h1>

      <div className="flex items-center gap-4">

        {!isAuth ? (
          <>
            <Link to="/login" className="px-4 py-2 rounded-lg text-purple-600 border border-purple-500 hover:bg-purple-100">
              Login
            </Link>

            <Link to="/register" className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
              Register
            </Link>
          </>
        ) : (
          <>
            {/* 👤 USER NAVBAR */}
            {user?.role === "user" && (
              <>
                <Link to="/home" className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  Home
                </Link>

                <Link to="/create" className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  Create Blog
                </Link>

                <Link to="/myblogs" className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  My Blogs
                </Link>
              </>
            )}

            {/* 👑 ADMIN NAVBAR */}
            {user?.role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  Dashboard
                </Link>

                <Link to="/admin/users" className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  Users
                </Link>

                <Link to="/admin/blogs" className="px-4 py-2 text-gray-700 hover:text-purple-600">
                  Blogs
                </Link>
              </>
            )}

            {/* NAME */}
            <span className="text-sm text-gray-600">
              👤 {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}