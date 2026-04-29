import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const res = await API.get("/blogs/myblogs", {
        withCredentials: true,
      });
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  
  const handlePublish = async (id) => {
    try {
      await API.put(`/blogs/publish/${id}`, {}, {
        withCredentials: true,
      });

      setBlogs(blogs.map(blog =>
        blog._id === id ? { ...blog, isPublished: true } : blog
      ));

      Swal.fire({
        title: "Published!",
        text: "Your blog is now live.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      console.log(err);
    }
  };

  
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/blogs/${id}`, {
          withCredentials: true,
        });

        setBlogs(blogs.filter((b) => b._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your blog has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <h1 className="text-3xl font-bold text-center text-black mb-8">
        My Blogs
      </h1>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {blogs.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No blogs found
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 overflow-hidden"
            >
              {blog.image && (
                <img
                  src={`http://localhost:5000/uploads/${blog.image}`}
                  alt="blog"
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-5">
                <h2 className="text-xl font-semibold text-purple-600 mb-2">
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>

                {/* ✅ Status Badge */}
                <div className="mb-3">
                  {blog.isPublished ? (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    View
                  </Link>

                  <div className="flex gap-2 flex-wrap">

                    
                    <Link
                      to={`/edit/${blog._id}`}
                      className="px-3 py-1.5 text-sm border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition cursor-pointer"
                    >
                      Edit
                    </Link>

                    
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow cursor-pointer"
                    >
                      Delete
                    </button>

                    
                    {!blog.isPublished && (
                      <button
                        onClick={() => handlePublish(blog._id)}
                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow cursor-pointer"
                      >
                        Publish
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}