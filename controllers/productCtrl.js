const Products = require("../models/productModel");
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIFeatures(Products.find(), req.query)
        .filter()
        .paginate()
        .sort()
        .limitFields();
      const products = await features.query;
      res.status(200).json({ products });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      // const product = await Products.findOne({ product_id: req.params.id });
      const product = await Products.findById(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const {
        images,
        product_id,
        title,
        description,
        content,
        price,
        category,
      } = req.body;

      if (!images) return res.status(400).json({ msg: "No image uploaded" });
      const product = await Products.findOne({ product_id });

      if (product)
        return res.status(400).json({ msg: "Product already exists" });

      const newProduct = new Products({
        images,
        product_id,
        title: title.toLowerCase(),
        description,
        content,
        price,
        category,
      });

      await newProduct.save();
      res.status(201).json({ msg: "Product saved successfully.", newProduct });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findOneAndDelete(req.params.id);
      res.status(204).json({ msg: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        images,
        product_id,
        title,
        description,
        content,
        price,
        category,
      } = req.body;

      if (!images) return res.status(400).json({ msg: "No image uploaded" });
      await Products.findOneAndUpdate(
        { _id: req.params.id },
        { images, product_id, title, description, content, price, category }
      );
      res.json("Updated a product");
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
