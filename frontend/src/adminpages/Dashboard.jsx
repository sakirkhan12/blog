import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/admin/dashboard");
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold text-purple-600">{data.totalUsers}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold">Total Blogs</h2>
          <p className="text-3xl font-bold text-purple-600">{data.totalBlogs}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold">Blocked Users</h2>
          <p className="text-3xl font-bold text-red-500">{data.blockedUsers}</p>
        </div>
      </div>
    </div>
  );
}