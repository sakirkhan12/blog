import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showComment, setShowComment] = useState(null);
  const [commentText, setCommentText] = useState({});

  const limit = 6;

  // FETCH BLOGS
  const fetchBlogs = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await API.get(
        `/blogs/publishblog?page=${page}&limit=${limit}`
      );

      setBlogs((prev) => [
        ...prev,
        ...res.data.blogs,
      ]);

      setHasMore(res.data.hasMore);

      if (res.data.hasMore) {
        setPage((prev) => prev + 1);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchBlogs();
  }, []);

  // SCROLL EVENT
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        fetchBlogs();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading]);

  // LIKE
  const handleLike = async (blogId) => {
    try {
      const res = await API.post("/likes/like", {
        blogId,
      });

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId
            ? {
                ...b,
                likesCount:
                  (b.likesCount || 0) +
                  (res.data.liked ? 1 : -1),
                isLiked: res.data.liked,
              }
            : b
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // COMMENT TOGGLE
  const toggleComment = (id) => {
    setShowComment(
      showComment === id ? null : id
    );
  };

  // COMMENT
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
                commentsCount:
                  (b.commentsCount || 0) + 1,
              }
            : b
        )
      );

      setCommentText({
        ...commentText,
        [blogId]: "",
      });

      setShowComment(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <h1 className="text-4xl text-center font-bold text-purple-600 mb-10">
        Published Blogs (Infinite Scroll)
      </h1>

      {/* BLOGS */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {blog.image && (
              <img
                src={`http://localhost:5000/uploads/${blog.image}`}
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

              {/* LIKE + COMMENT */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() =>
                    handleLike(blog._id)
                  }
                >
                  {blog.isLiked
                    ? "❤️"
                    : "🤍"}{" "}
                  {blog.likesCount || 0}
                </button>

                <button
                  onClick={() =>
                    toggleComment(blog._id)
                  }
                >
                  💬 {blog.commentsCount || 0}
                </button>
              </div>

              {/* COMMENT BOX */}
              {showComment === blog._id && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Write comment..."
                    value={
                      commentText[blog._id] ||
                      ""
                    }
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [blog._id]:
                          e.target.value,
                      })
                    }
                    className="border w-full p-2 mb-2 rounded"
                  />

                  <button
                    onClick={() =>
                      handleComment(blog._id)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
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
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center mt-6">
          Loading more blogs...
        </p>
      )}

      {/* END MESSAGE */}
      {!hasMore && (
        <p className="text-center mt-6 text-gray-500">
          No more blogs
        </p>
      )}

    </div>
  );
}