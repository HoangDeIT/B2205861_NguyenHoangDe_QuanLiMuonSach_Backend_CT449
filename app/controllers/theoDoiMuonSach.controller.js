const TheoDoiMuonSachService = require("../service/theoDoiMuonSach.service");
const MongoDB = require("../utils/mongodb.util");
const TokenUtil = require("../utils/token.util");
exports.create = async (req, res) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const doc = await service.create(req.body);
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi thêm theo dõi mượn sách" });
    }
};

exports.findAll = async (req, res) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const { page = 1, limit = 10, isTra = false } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const result = await service.getAll(pageNumber, pageSize, isTra);
        return res.send(result);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi lấy danh sách theo dõi mượn sách" });
    }
};

exports.updateById = async (req, res) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const doc = await service.update(req.body._id, req.body);
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi cập nhật theo dõi mượn sách" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (result) {
            return res.send({ message: "Xóa theo dõi mượn sách thành công" });
        } else {
            return res.status(404).send({ message: "Không tìm thấy theo dõi mượn sách để xóa" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi xóa theo dõi mượn sách" });
    }
};
exports.getById = async (req, res) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const doc = await service.getByIdDocGia(req.params.id);

        if (!doc) {
            return res.status(404).send({ message: "Không tìm thấy theo dõi mượn sách" });
        }
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi tìm theo dõi muien sach" });
    }
};
exports.handleTraSach = async (req, res) => {
    try {
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const doc = await service.handleTraSach(req.params.id);
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi tìm theo dõi muien sach" });
    }
}
exports.createByUser = async (req, res) => {
    try {
        // const service = new TheoDoiMuonSachService(MongoDB.client);
        // const doc = await service.create(req.body);
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const MADOCGIA = TokenUtil.getUserFromToken(req?.headers?.authorization);
        const soLuongSachDaMuon = await service.countByMADOCGIA(MADOCGIA);
        if (soLuongSachDaMuon >= 3) return res.status(500).send({ message: "Vui lòng trả" });
        const MASACH = req.body.MASACH;
        const NGAYMUON = new Date().toLocaleDateString("en-GB");
        const doc = await service.create({ MADOCGIA, MASACH, NGAYMUON })
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};
exports.findMuonByDocGia = async (req, res) => {
    try {
        const MANV = TokenUtil.getUserFromToken(req?.headers?.authorization);
        const service = new TheoDoiMuonSachService(MongoDB.client);
        const doc = await service.getByIdDocGia(MANV);

        if (!doc) {
            return res.status(404).send({ message: "Không tìm thấy theo dõi mượn sách" });
        }
        return res.send(doc);
    } catch (error) {
        return res.status(500).send({ message: "Lỗi khi tìm theo dõi muien sach" });
    }
}