const DocGiaService = require("../service/reader.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const StaffService = require("../service/staff.service");
const ReaderService = require("../service/reader.service");

dotenv.config();
exports.login = async (req, res) => {
    try {
        const { MANV, password } = req.body;

        const staffService = new StaffService(MongoDB.client);

        const staff = await staffService.getMANV(MANV);
        if (!staff) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, staff.Password);

        if (!isPasswordValid) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Tạo JWT token

        const token = jwt.sign({ MANV: staff.MANV }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const { Password, ...user } = staff;
        res.json({ user, access_token: token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
}
exports.loginWithUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const docgiaService = new DocGiaService(MongoDB.client);

        const docgia = await docgiaService.getPhoneOne(phone);
        if (!docgia) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, docgia.Password);

        if (!isPasswordValid) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Tạo JWT token

        const token = jwt.sign({ MADOCGIA: docgia.MADOCGIA }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const { Password, ...user } = docgia;
        res.json({ user, access_token: token });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!" });
    }
}
exports.register = async (req, res) => {
    try {
        const readerService = new ReaderService(MongoDB.client);

        const reader = await readerService.getPhoneOne(req.body.DIENTHOAI);
        if (reader) return res.status(400).json({ message: "Số điện thoại này đã đăng kí rồi" });

        const document = await readerService.create(req.body);
        return res.send(document);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi tạo độc giả" });
    }
};
