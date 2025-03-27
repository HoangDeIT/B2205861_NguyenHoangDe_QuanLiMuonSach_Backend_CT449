const { ObjectId } = require("mongodb");

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
        const SachService = require("./sach.service");

        const sachService = new SachService(MongoDB.client);
        const doc = this.extractTheoDoiMuonSachData(payload);
        const sach = await sachService.getById(doc.MASACH);
        console.log("323")
        if (sach.SOQUYEN === 0) {
            throw new Error("Sach khong con trong kho");
        }
        console.log("323")
        await sachService.updateQuantity(doc.MASACH, sach.SOQUYEN - 1);
        console.log("323")
        const result = await this.TheoDoiMuonSach.insertOne(doc);
        return result;
    }

    async getAll(page, limit, isTra) {
        // Ví dụ: tìm kiếm theo MASACH


        const query = isTra == "true"
            ? { NGAYTRA: { $exists: true, $ne: null } }  // Tìm bản ghi có NGAYTRA
            : { NGAYTRA: { $exists: false } };           // Tìm bản ghi không có NGAYTRA
        console.log(query)
        const skip = (page - 1) * limit;

        let docs = await this.TheoDoiMuonSach.find(query)
            .skip(skip)
            .limit(limit)
            .toArray();
        const ReaderService = require("./reader.service");
        const SachService = require("./sach.service");
        const readerService = new ReaderService(MongoDB.client);
        const sachService = new SachService(MongoDB.client);
        try {
            docs = await Promise.all(docs.map(async (item) => {



                const reader = await readerService.getById(item.MADOCGIA);
                const sach = await sachService.getById(item.MASACH);
                console.log(item.MADOCGIA)
                console.log(reader)
                return {
                    ...item, HoTenDocGia: reader ? reader.HOLOT + " " + reader.TEN : "Không xác định",
                    TenSach: sach ? sach.TENSACH : "Không xác định"
                };
            }));
        } catch (e) {
            console.log(e)
        }

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
        const ReaderService = require("./reader.service");
        const SachService = require("./sach.service");
        const readerService = new ReaderService(MongoDB.client);
        const sachService = new SachService(MongoDB.client);


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
    async getById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.TheoDoiMuonSach.findOne({ _id: new ObjectId(id) });
        return result;
    }
    async handleTraSach(payload) {
        // Chuyển đổi ngày hiện tại thành định dạng DD/MM/YYYY
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-GB");  // Định dạng DD/MM/YYYY
        const SachService = require("./sach.service");
        const sachService = new SachService(MongoDB.client);
        const muon = await this.getById(payload);
        const sach = await sachService.getById(muon.MASACH);
        await sachService.updateQuantity(muon.MASACH, sach.SOQUYEN + 1);
        // Cập nhật ngày trả sách với định dạng chuỗi DD/MM/YYYY
        const result = await this.TheoDoiMuonSach.findOneAndUpdate(
            { _id: new ObjectId(payload) },
            { $set: { NGAYTRA: formattedDate } },
            { returnDocument: "after" }
        );

        return result;
    }
    async deleteByMASACH(MASACH) {
        const result = await this.TheoDoiMuonSach.deleteMany({ MASACH: MASACH });
        return result.deletedCount > 0;
    }
    async deleteByMADOCGIA(MADOCGIA) {
        const result = await this.TheoDoiMuonSach.deleteMany({ MADOCGIA: MADOCGIA });
        return result.deletedCount > 0;
    }

    async countByMADOCGIA(MADOCGIA) {
        const result = await this.TheoDoiMuonSach.countDocuments({ MADOCGIA: MADOCGIA, NGAYTRA: { $exists: false } });
        return result;
    }
}

module.exports = TheoDoiMuonSachService;
