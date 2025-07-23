const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    collaborators: {
      type: [String],
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled",
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
