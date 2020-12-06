const crypto = require("crypto");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // id: false,
    name: {
      type: "string",
      trim: true,
      unique: true,
      required: [true, "A category must have a name"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
