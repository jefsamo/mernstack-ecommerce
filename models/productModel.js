const crypto = require("crypto");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: [true, "A product must have an id"],
      trim: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "A product must have an id"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
    },
    content: {
      type: String,
      required: [true, "A product must have a content"],
    },
    images: {
      type: Object,
      required: [true, "A product must have image/images"],
    },
    category: {
      type: String,
      required: [true, "A product must belong to a category"],
    },
    checked: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
