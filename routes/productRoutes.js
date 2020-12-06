const express = require("express");
const productCtrl = require("../controllers/productCtrl");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

const router = express.Router();

router.route("/").get(productCtrl.getProducts).post(productCtrl.createProduct);

router
  .route("/:id")
  .get(productCtrl.getProduct)
  .delete(productCtrl.deleteProduct)
  .patch(auth, authAdmin, productCtrl.updateProduct);

module.exports = router;
