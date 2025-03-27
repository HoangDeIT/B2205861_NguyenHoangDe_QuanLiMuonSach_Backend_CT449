const express = require("express");
const controller = require("../controllers/sach.controller");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const authorizeRole = require("../middlewares/role");
router.route("/")
    .post(authenticateToken, authorizeRole("admin"), controller.create)     // Thêm sách
    .get(controller.findAll)     // Lấy DS sách + search + phân trang
    .put(authenticateToken, authorizeRole("admin"), controller.updateById); // Cập nhật sách

router.route("/:id")
    .delete(authenticateToken, authorizeRole("admin"), controller.deleteById); // Xóa sách theo _id
router.route("/get-all")
    .get(controller.getAllNoPagination);
module.exports = router;
