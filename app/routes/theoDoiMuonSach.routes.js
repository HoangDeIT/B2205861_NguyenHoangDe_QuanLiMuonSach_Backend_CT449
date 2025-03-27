const express = require("express");
const controller = require("../controllers/theoDoiMuonSach.controller");
const authorizeRole = require("../middlewares/role");
const authenticateToken = require("../middlewares/auth");
const router = express.Router();

router.route("/")
    .post(authenticateToken, authorizeRole("admin"), controller.create)       // Thêm theo dõi mượn sách
    .get(authenticateToken, authorizeRole("admin"), controller.findAll)       // Lấy DS theo dõi + search + phân trang
    .patch(authenticateToken, authorizeRole("admin"), controller.updateById);   // Cập nhật
router.route("/user")
    .post(authenticateToken, authorizeRole("user"), controller.createByUser)
    .get(authenticateToken, authorizeRole("user"), controller.findMuonByDocGia);
router.route("/:id")
    .delete(authenticateToken, authorizeRole("admin"), controller.deleteById) // Xóa theo _id
    .get(authenticateToken, authorizeRole("admin", "user"), controller.getById)
    .post(authenticateToken, authorizeRole("admin"), controller.handleTraSach)


module.exports = router;
