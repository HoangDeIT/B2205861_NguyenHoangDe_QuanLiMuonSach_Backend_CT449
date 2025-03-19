const SachService = require("../service/sach.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res) => {
    try {
        const service = new SachService(MongoDB.client);
        req.body.SOQUYEN = Number(req.body.SOQUYEN);
        console.log(req.body)
        const doc = await service.create(req.body);

        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi thêm sách" });
    }
};

exports.findAll = async (req, res) => {
    try {
        const service = new SachService(MongoDB.client);
        const { page = 1, limit = 10, search = "" } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        const result = await service.getAll(pageNumber, pageSize, search);
        return res.send(result);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi lấy danh sách sách" });
    }
};

exports.updateById = async (req, res) => {
    try {
        const service = new SachService(MongoDB.client);
        req.body.SOQUYEN = Number(req.body.SOQUYEN);
        const doc = await service.update(req.body._id, req.body);
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi cập nhật sách" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const service = new SachService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (result) {
            return res.send({ message: "Xóa sách thành công" });
        } else {
            return res.status(404).send({ message: "Không tìm thấy sách để xóa" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi xóa sách" });
    }
};
exports.getAllNoPagination = async (req, res) => {
    try {
        const service = new SachService(MongoDB.client);
        const result = await service.getAllNoPagination();
        return res.send(result);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi lấy danh sách sách" });
    }
};
