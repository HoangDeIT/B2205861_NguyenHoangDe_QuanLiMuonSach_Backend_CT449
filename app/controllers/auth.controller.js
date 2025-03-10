const StaffService = require("../service/staff.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const { phone, password } = req.body;

        const staffService = new StaffService(MongoDB.client);

        const staff = await staffService.getPhoneOne(phone);
        if (!staff) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, staff.Password);

        if (!isPasswordValid) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Tạo JWT token

        const token = jwt.sign({ userName: staff.HoTenNV }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const { Password, ...user } = staff;
        res.json({ user, access_token: token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
}