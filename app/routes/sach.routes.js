const express = require("express");
const controller = require("../controllers/sach.controller");
const router = express.Router();

router.route("/")
    .post(controller.create)     // Thêm sách
    .get(controller.findAll)     // Lấy DS sách + search + phân trang
    .put(controller.updateById); // Cập nhật sách

router.route("/:id")
    .delete(controller.deleteById); // Xóa sách theo _id
router.route("/get-all")
    .get(controller.getAllNoPagination);
module.exports = router;
