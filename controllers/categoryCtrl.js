const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const categoryCtrl = {
  getCategories: async (req, res) => {
    const categories = await Category.find();
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({ msg: "Category already exists" });

      const newCategory = new Category({ name });
      await newCategory.save();

      res.json({ msg: "New Category created" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllCategories: async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Product.findOne({ category: req.params.id });
      if (products)
        return res
          .status(400)
          .json({ msg: "Please delete all products with relationship" });

      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted Category" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });
      res.json({ msg: "Updated a category" });
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  },
};

module.exports = categoryCtrl;
