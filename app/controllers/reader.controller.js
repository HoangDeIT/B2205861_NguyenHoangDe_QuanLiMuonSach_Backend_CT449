const ReaderService = require("../service/reader.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
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
