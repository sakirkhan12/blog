import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (pageNumber) => {
    try {
      //  CHANGE HERE (published API)
      const res = await API.get(
        `/blogs/publishblog?page=${pageNumber}&limit=${limit}`
      );

      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-3">
          Welcome to Home Page only showing published blogs 
        </h1>
        <p className="text-gray-600">
          Explore published blogs by users
        </p>
      </div>

      {/* Blogs Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {blogs.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No blogs available
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {blog.image && (
                <img
                  src={`http://localhost:5000/uploads/${blog.image}`}
                  alt="blog"
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-5">
                <h2 className="text-lg font-semibold text-purple-600 mb-2">
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {blog.content}
                </p>

                {blog.user && (
                  <p className="text-xs text-gray-400 mb-2">
                    By: {blog.user.name}
                  </p>
                )}

                <Link
                  to={`/blog/${blog._id}`}
                  className="text-purple-600 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12">
        
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}