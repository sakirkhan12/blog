const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {          
      type: Boolean,
      default: false,        // default = draft
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);