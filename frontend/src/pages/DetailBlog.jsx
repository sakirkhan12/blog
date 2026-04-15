import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await API.get(`/blogs/${id}`);
                setBlog(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchBlog();
    }, [id]);

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

                {/* Title */}
                <h1 className="text-3xl font-bold text-purple-600 mb-2">
                    {blog.title}
                </h1>


                <div className="w-20 h-1 bg-purple-500 mb-4 rounded"></div>


                <p className="text-gray-500 font-semibold mb-1">Content:</p>


                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {blog.content}
                </p>

            </div>
        </div>
    );
}