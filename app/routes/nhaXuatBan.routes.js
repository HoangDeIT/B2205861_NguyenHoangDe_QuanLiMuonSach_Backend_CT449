const express = require("express");
const controller = require("../controllers/nhaXuatBan.controller");
const router = express.Router();

router.route("/")
    .post(controller.create)     // Thêm NXB
    .get(controller.findAll)     // Lấy DS NXB + search + phân trang
    .put(controller.updateById); // Cập nhật NXB

router.route("/:id")
    .delete(controller.deleteById); // Xóa NXB theo _id
router.route("/get-all")
    .get(controller.getAllNoPagination
    );
module.exports = router;
