const express = require('express');
const readers = require("../controllers/reader.controller");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const authorizeRole = require("../middlewares/role");
router.route("/")
    .post(authenticateToken, authorizeRole("admin"), readers.create)  // Thêm mới độc giả
    .get(authenticateToken, authorizeRole("admin"), readers.findAll)  // Lấy danh sách độc giả + tìm kiếm + phân trang
    .put(authenticateToken, authorizeRole("admin"), readers.updateById); // Cập nhật thông tin độc giả
router.route("/user")
    .get(authenticateToken, authorizeRole("user"), readers.findByUser)
    .put(authenticateToken, authorizeRole("user"), readers.updatedByUser)
router.route("/user/change-password")
    .put(authenticateToken, authorizeRole("user"), readers.changePassword)
router.route("/:id")
    .delete(authenticateToken, authorizeRole("admin"), readers.deleteById); // Xóa độc giả theo ID

router.route("/phone/:phone")
    .get(readers.findByPhone); // Tìm độc giả theo số điện thoại

module.exports = router;
