const express = require("express");
const controller = require("../controllers/upload.controller");
const multer = require("multer");
const { storage } = require("../utils/upload.utils");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/sach")
    .post(upload.single("image"), controller.uploadImage,)       // Thêm theo dõi mượn sách// Cập nhật

module.exports = router;
