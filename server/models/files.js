const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("files", fileSchema, "files");
