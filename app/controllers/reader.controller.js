const ReaderService = require("../service/reader.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const TokenUtil = require("../utils/token.util");
exports.create = async (req, res) => {
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

exports.findAll = async (req, res) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const { page = 1, limit = 10, search = "" } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const readers = await service.getAll(pageNumber, pageSize, search);
        res.json(readers);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi lấy danh sách độc giả" });
    }
};

exports.findByPhone = async (req, res) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const reader = await service.getPhoneOne(req.params.phone);
        if (!reader) {
            return res.status(404).send({ message: "Không tìm thấy độc giả" });
        }
        res.json(reader);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi tìm độc giả theo số điện thoại" });
    }
};

exports.updateById = async (req, res) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const readerDB = await service.getById(req.body.MADOCGIA);
        if (!readerDB) {
            return res.status(404).send({ message: "Không tìm thấy độc giả" });
        }
        if (readerDB.DIENTHOAI !== req.body.DIENTHOAI) {
            const reader = await service.getPhoneOne(req.body.DIENTHOAI);
            if (reader) return res.status(400).json({ message: "Số điện thoại này đã đăng kí rồi" });
        }
        const reader = await service.update(req.body._id, req.body);
        res.json(reader);

    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi cập nhật độc giả" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (result) {
            res.send({ message: "Độc giả đã được xóa thành công" });
        } else {
            res.status(404).send({ message: "Không tìm thấy độc giả để xóa" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi xóa độc giả" });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const MADOCGIA = TokenUtil.getUserFromToken(req?.headers?.authorization);
        const service = new ReaderService(MongoDB.client);
        const docgia = await service.getById(MADOCGIA);
        if (!docgia) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(req.body.oldPassword, docgia.Password);
        if (isPasswordValid) {
            const service = new ReaderService(MongoDB.client);
            const newPassword = await bcrypt.hash(req.body.newPassword, 10);
            const reader = await service.changePassword(MADOCGIA, newPassword);
            res.json(reader);
        } else {
            return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        }

    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi thêm độc giả" });
    }
};
exports.updatedByUser = async (req, res) => {
    try {
        const MADOCGIA1 = TokenUtil.getUserFromToken(req?.headers?.authorization);
        const service = new ReaderService(MongoDB.client);
        const docgia = await service.getById(MADOCGIA1);
        if (!docgia) {
            return res.status(404).send({ message: "Không tìm thấy độc giả" });
        }
        if (docgia.DIENTHOAI !== req.body.DIENTHOAI) {
            const reader = await service.getPhoneOne(req.body.DIENTHOAI);
            if (reader) return res.status(400).json({ message: "Số điện thoại này đã đăng kí rồi" });
        }
        const { MADOCGIA, Password, ...payload } = req.body;
        payload.MADOCGIA = MADOCGIA1;
        payload._id = docgia._id;

        const reader = await service.update(docgia._id, payload);
        res.json(reader);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi cập nhật độc giả" });
    }
};

exports.findByUser = async (req, res) => {
    try {
        const MADOCGIA1 = TokenUtil.getUserFromToken(req?.headers?.authorization);
        const service = new ReaderService(MongoDB.client);
        const docgia = await service.getById(MADOCGIA1);
        res.json(docgia);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi cập nhật độc giả" });
    }
};  
