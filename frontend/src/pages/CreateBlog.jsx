import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateBlog() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const file = data.image[0];

      if (file.size > 10 * 1024 * 1024) {
        return setFileError("File size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("image", file);

      await API.post("/blogs/createBlog", formData);

      reset();
      setPreview(null);
      setFileError("");
      navigate("/myblogs");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-purple-500 to-indigo-600 px-4">
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">
          Welcome to Create Blog Page 
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Share your thoughts with the world
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Blog Content
            </label>
            <textarea
              rows="6"
              placeholder="Write your blog here..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("content", {
                required: "Content is required",
                minLength: { value: 10, message: "Minimum 10 characters" },
              })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full"
              {...register("image", {
                required: "Image is required",
              })}
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) return;

                if (file.size > 10 * 1024 * 1024) {
                  setFileError("File size must be less than 10MB");
                  setPreview(null);
                  return;
                }

                setFileError("");
                setPreview(URL.createObjectURL(file));
              }}
            />

            {errors.image && (
              <p className="text-red-500 text-sm">
                {errors.image.message}
              </p>
            )}

            {fileError && (
              <p className="text-red-500 text-sm">{fileError}</p>
            )}
          </div>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
}