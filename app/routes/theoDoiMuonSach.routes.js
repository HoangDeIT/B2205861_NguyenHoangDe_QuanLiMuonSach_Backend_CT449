const express = require("express");
const controller = require("../controllers/theoDoiMuonSach.controller");
const router = express.Router();

router.route("/")
    .post(controller.create)       // Thêm theo dõi mượn sách
    .get(controller.findAll)       // Lấy DS theo dõi + search + phân trang
    .put(controller.updateById);   // Cập nhật

router.route("/:id")
    .delete(controller.deleteById) // Xóa theo _id
    .get(controller.getById);
module.exports = router;
