const express = require('express');
const staffs = require("../controllers/staff.controller");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const authorizeRole = require("../middlewares/role");
router.route("/")
    .post(authenticateToken, authorizeRole("admin"), staffs.create)
    .get(authenticateToken, authorizeRole("admin"), staffs.findAll)
    .put(authenticateToken, authorizeRole("admin"), staffs.updateById);
router.route("/:id")
    .delete(authenticateToken, authorizeRole("admin"), staffs.deleteById);
module.exports = router;