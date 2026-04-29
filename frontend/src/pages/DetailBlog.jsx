import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const blogRes = await API.get(`/blogs/${id}`);
      const commentRes = await API.get(`/comments/${id}`);
      const likeRes = await API.get(`/likes/${id}`);

      setBlog(blogRes.data);
      setComments(commentRes.data);
      setLikes(likeRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (!blog) {
    return <p className="text-center mt-10 text-lg">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex justify-center">
      <div className="bg-white max-w-2xl w-full p-6 rounded-2xl shadow-lg">

        {blog.image && (
          <div className="bg-gray-100 flex justify-center rounded-2xl mb-6 p-3">
            <img
              src={`http://localhost:5000/uploads/${blog.image}`}
              alt="blog"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-purple-600 mb-2">
          {blog.title}
        </h1>

        <div className="w-20 h-1 bg-purple-500 mb-4 rounded"></div>

        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-6">
          {blog.content}
        </p>

        {/*  Likes */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">
            ❤️ Liked by ({likes.length})
          </h2>

          {likes.length === 0 ? (
            <p className="text-gray-500 text-sm">No likes yet</p>
          ) : (
            likes.map((l) => (
              <p key={l._id} className="text-sm text-gray-700">
                {l.user?.name}
              </p>
            ))
          )}
        </div>

        {/* Comments */}
        <div>
          <h2 className="font-semibold text-lg mb-2">
            💬 Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet</p>
          ) : (
            comments.map((c) => (
              <div
                key={c._id}
                className="border-b py-2 text-sm text-gray-700"
              >
                <span className="font-semibold">
                  {c.user?.name}:
                </span>{" "}
                {c.text}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}