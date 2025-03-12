const express = require('express');
const readers = require("../controllers/reader.controller");
const router = express.Router();

router.route("/")
    .post(readers.create)  // Thêm mới độc giả
    .get(readers.findAll)  // Lấy danh sách độc giả + tìm kiếm + phân trang
    .put(readers.updateById); // Cập nhật thông tin độc giả

router.route("/:id")
    .delete(readers.deleteById); // Xóa độc giả theo ID

router.route("/phone/:phone")
    .get(readers.findByPhone); // Tìm độc giả theo số điện thoại

module.exports = router;
