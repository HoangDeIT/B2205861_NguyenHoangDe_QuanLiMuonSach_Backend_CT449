const { ObjectId } = require("mongodb");
const ReaderService = require("./reader.service");
const SachService = require("./sach.service");
const MongoDB = require("../utils/mongodb.util");

class TheoDoiMuonSachService {
    constructor(client) {
        this.TheoDoiMuonSach = client.db().collection("THEODOIMUONSACH");
    }

    extractTheoDoiMuonSachData(payload) {
        const doc = {
            MADOCGIA: payload.MADOCGIA,
            MASACH: payload.MASACH,
            NGAYMUON: payload.NGAYMUON,
            NGAYTRA: payload.NGAYTRA
        };
        Object.keys(doc).forEach((key) => doc[key] === undefined && delete doc[key]);
        return doc;
    }

    async create(payload) {
        const doc = this.extractTheoDoiMuonSachData(payload);
        const result = await this.TheoDoiMuonSach.insertOne(doc);
        return result;
    }

    async getAll(page, limit, search) {
        // Ví dụ: tìm kiếm theo MASACH
        const query = search ? { MASACH: { $regex: search, $options: "i" } } : {};
        const skip = (page - 1) * limit;

        let docs = await this.TheoDoiMuonSach.find(query)
            .skip(skip)
            .limit(limit)
            .toArray();

        docs = await Promise.all(docs.map(async (item) => {


            const readerService = new ReaderService(MongoDB.client)
            const sachService = new SachService(MongoDB.client)
            const reader = await readerService.getById(item.MADOCGIA);
            const sach = await sachService.getById(item.MASACH);

            return { ...item, HoTenDocGia: reader.HOLOT + " " + reader.TEN, TenSach: sach.TENSACH };
        }))
        const total = await this.TheoDoiMuonSach.countDocuments(query);
        return {
            data: docs,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    async update(id, payload) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const doc = this.extractTheoDoiMuonSachData(payload);

        const result = await this.TheoDoiMuonSach.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.TheoDoiMuonSach.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
    async getByIdDocGia(id) {
        const readerService = new ReaderService(MongoDB.client)
        const sachService = new SachService(MongoDB.client)

        let res = await this.TheoDoiMuonSach.find({ MADOCGIA: id }).toArray();
        res = await Promise.all(res.map(async (item) => {

            const dg = await readerService.getById(item.MADOCGIA);
            const s = await sachService.getById(item.MASACH);

            const TENDOCGIA = dg.HOLOT + " " + dg.TEN;
            const TENSACH = s.TENSACH;
            item.TENDOCGIA = TENDOCGIA;
            item.TENSACH = TENSACH;
            return item;
        }));

        return res
    }
    async handleTraSach(payload) {
        // Chuyển đổi ngày hiện tại thành định dạng DD/MM/YYYY
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-GB");  // Định dạng DD/MM/YYYY

        // Cập nhật ngày trả sách với định dạng chuỗi DD/MM/YYYY
        const result = await this.TheoDoiMuonSach.findOneAndUpdate(
            { _id: new ObjectId(payload) },
            { $set: { NGAYTRA: formattedDate } },
            { returnDocument: "after" }
        );

        return result;
    }

}

module.exports = TheoDoiMuonSachService;
