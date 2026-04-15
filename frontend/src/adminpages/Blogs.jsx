import { useEffect, useState } from "react";
import API from "../services/api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/admin/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    await API.delete(`/admin/blogs/${id}`);
    fetchBlogs();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">
        All Blogs
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
          >
            {/* IMAGE */}
            {blog.image && (
              <img
                 src={`http://localhost:5000/uploads/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>

              <p className="text-gray-600 mb-3">
                {blog.content?.slice(0, 100)}...
              </p>

              <p className="text-sm text-gray-500 mb-3">
                👤 By: {blog.user?.name}
              </p>

              <button
                onClick={() => deleteBlog(blog._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}