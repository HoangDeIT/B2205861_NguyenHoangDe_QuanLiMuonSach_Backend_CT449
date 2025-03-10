const express = require('express');
const staffs = require("../controllers/staff.controller");
const router = express.Router();
router.route("/")
    .post(staffs.create)
    .get(staffs.findAll)
    .put(staffs.updateById);
router.route("/:id")
    .delete(staffs.deleteById);
module.exports = router;