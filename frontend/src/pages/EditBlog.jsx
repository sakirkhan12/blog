import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useForm } from "react-hook-form";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setValue("title", res.data.title);
        setValue("content", res.data.content);

        if (res.data.image) {
          setPreview(`http://localhost:5000/uploads/${res.data.image}`);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlog();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/blogs/${id}`, formData, {
        withCredentials: true,
      });

      navigate("/myblogs");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
      
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Edit Blog 
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>

          
          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea
              rows="6"
              {...register("content", {
                required: "Content is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">
                {errors.content.message}
              </p>
            )}
          </div>

          
          <div>
            <label className="block font-medium mb-1">
              Update Image
            </label>

            <input
              type="file"
              className="w-full"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                  setFileName(file.name);
                }
              }}
            />

            {fileName && (
              <p className="text-sm text-gray-600 mt-1">
                Selected file:{" "}
                <span className="font-medium">{fileName}</span>
              </p>
            )}
          </div>

          
          {preview && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <img
                src={preview}
                alt="preview"
                className="w-full h-60 object-cover rounded-lg"
              />
            </div>
          )}

          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition cursor-pointer"
          >
            Update Blog 
          </button>

        </form>
      </div>
    </div>
  );
}