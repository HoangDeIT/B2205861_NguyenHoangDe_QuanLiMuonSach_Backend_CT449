const express = require("express");
const controller = require("../controllers/nhaXuatBan.controller");
const authenticateToken = require("../middlewares/auth");
const authorizeRole = require("../middlewares/role");
const router = express.Router();

router.route("/")
    .post(authenticateToken, authorizeRole("admin"), controller.create)     // Thêm NXB
    .get(controller.findAll)     // Lấy DS NXB + search + phân trang
    .put(authenticateToken, authorizeRole("admin"), controller.updateById); // Cập nhật NXB

router.route("/:id")
    .delete(authenticateToken, authorizeRole("admin"), controller.deleteById); // Xóa NXB theo _id
router.route("/get-all")
    .get(controller.getAllNoPagination
    );
module.exports = router;
