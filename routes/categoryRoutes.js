const express = require("express");
const categoryCtrl = require("../controllers/categoryCtrl");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router
  .route("/")
  .get(categoryCtrl.getAllCategories)
  .post(auth, authAdmin, categoryCtrl.createCategory);

router
  .route("/:id")
  .delete(auth, authAdmin, categoryCtrl.deleteCategory)
  .put(auth, authAdmin, categoryCtrl.updateCategory);

module.exports = router;
