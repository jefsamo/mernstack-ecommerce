const express = require("express");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");
const cloudinary = require("cloudinary");
const fs = require("fs");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

router.post("/upload", auth, authAdmin, (req, res) => {
  try {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No file was uploaded" });

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      removeTemp(file.tempFilePath);
      return res.status(400).json({ msg: "File too large" });
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTemp(file.tempFilePath);
      return res.status(400).json({ msg: "Invalid file format" });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "test" },
      async (err, result) => {
        if (err) throw err;
        removeTemp(file.tempFilePath);
        res.json({ public_id: result.public_id, url: result.secure_url });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

router.post("/destroy", (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) return res.status(400).json({ msg: "No images selected" });
    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: "Deleted msg" });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};
module.exports = router;
