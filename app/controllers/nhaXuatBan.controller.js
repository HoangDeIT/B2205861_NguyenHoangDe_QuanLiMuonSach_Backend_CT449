const NhaXuatBanService = require("../service/nhaXuatBan.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const doc = await service.create(req.body);
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi thêm nhà xuất bản" });
    }
};

exports.findAll = async (req, res) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const { page = 1, limit = 10, search = "" } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        const result = await service.getAll(pageNumber, pageSize, search);
        return res.send(result);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi lấy danh sách nhà xuất bản" });
    }
};

exports.updateById = async (req, res) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const doc = await service.update(req.body._id, req.body);
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi cập nhật nhà xuất bản" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (result) {
            return res.send({ message: "Xóa nhà xuất bản thành công" });
        } else {
            return res.status(404).send({ message: "Không tìm thấy nhà xuất bản để xóa" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi xóa nhà xuất bản" });
    }
};
exports.getAllNoPagination = async (req, res) => {
    try {
        const service = new NhaXuatBanService(MongoDB.client);
        const result = await service.getAllNoPagination();
        return res.send(result);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi lấy danh sách nhà xuất bản" });
    }
};