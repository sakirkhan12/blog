import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showComment, setShowComment] = useState(null);
  const [commentText, setCommentText] = useState({});

  const limit = 6;

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (pageNumber) => {
    try {
      const res = await API.get(
        `/blogs/publishblog?page=${pageNumber}&limit=${limit}`
      );

      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  //  LIKE
  const handleLike = async (blogId) => {
    try {
      const res = await API.post("/likes/like", { blogId });

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? {
              ...b,
              likesCount: (b.likesCount || 0) + (res.data.liked ? 1 : -1),
              isLiked: res.data.liked,
            }
            : b
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // toggle comment box
  const toggleComment = (id) => {
    setShowComment(showComment === id ? null : id);
  };

  //  add comment
  const handleComment = async (blogId) => {
    if (!commentText[blogId]) return;

    try {
      await API.post("/comments/comment", {
        text: commentText[blogId],
        blogId,
      });

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? {
              ...b,
              commentsCount: (b.commentsCount || 0) + 1,
            }
            : b
        )
      );

      setCommentText({ ...commentText, [blogId]: "" });
      setShowComment(null);

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
          Welcome to Home Page this page showing only published blogs by users !
        </h1>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {blogs.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No blogs available
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
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

                <p className="text-gray-600 text-sm mb-3">
                  {blog.content}
                </p>

                {blog.user && (
                  <p className="text-xs text-gray-400 mb-2">
                    By: {blog.user.name}
                  </p>
                )}

                <div className="flex justify-between mt-3 c">

                  <button className="cursor-pointer" onClick={() => handleLike(blog._id)}>
                    {blog.isLiked ? "❤️" : "🤍"} {blog.likesCount || 0}
                  </button>

                  <button className="cursor-pointer" onClick={() => toggleComment(blog._id)}>
                    💬 {blog.commentsCount || 0}
                  </button>

                </div>

                {showComment === blog._id && ( 
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Write comment..."
                      value={commentText[blog._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [blog._id]: e.target.value,
                        })
                      }
                      className="border w-full p-2 mb-2 rounded"
                    />

                    <button
                      onClick={() => handleComment(blog._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Post
                    </button>
                  </div>
                )}

                <Link
                  to={`/blog/${blog._id}`}
                  className="block mt-2 text-purple-600"
                >
                  Read More →
                </Link>

              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-12">

        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages} 
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>

      </div>

    </div>
  );
}