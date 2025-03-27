const { ObjectId } = require("mongodb");
const SachService = require("./sach.service");
const MongoDB = require("../utils/mongodb.util");




class NhaXuatBanService {
    constructor(client) {
        this.NhaXuatBan = client.db().collection("NHAXUATBAN");
    }

    // Chuẩn hóa dữ liệu trước khi ghi vào DB
    extractNhaXuatBanData(payload) {
        const doc = {

            TENNXB: payload.TENNXB,
            DIACHI: payload.DIACHI
        };
        // Xóa các trường undefined
        Object.keys(doc).forEach((key) => doc[key] === undefined && delete doc[key]);
        return doc;
    }

    // Tạo mới
    async create(payload) {
        const session = await this.NhaXuatBan.client.startSession();
        try {
            session.startTransaction();
            const doc = this.extractNhaXuatBanData(payload);

            const maxNXB = await this.NhaXuatBan.find({ MANXB: /^NXB\d+$/ }).toArray();
            const maxNumber = maxNXB
                .map(item => parseInt(item.MANXB.replace("NXB", ""), 10))
                .filter(num => !isNaN(num))
                .reduce((max, num) => Math.max(max, num), 0);

            doc.MANXB = `NXB${maxNumber + 1}`;
            const result = await this.NhaXuatBan.insertOne(doc, { session });
            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    // Lấy danh sách + tìm kiếm + phân trang
    async getAll(page, limit, search) {
        const query = search ? { TENNXB: { $regex: search, $options: "i" } } : {};
        const skip = (page - 1) * limit;

        const docs = await this.NhaXuatBan.find(query)
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await this.NhaXuatBan.countDocuments(query);
        return {
            data: docs,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getAllNoPagination() {
        return await this.NhaXuatBan.find({}).toArray();
    }
    // Cập nhật
    async update(id, payload) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const doc = this.extractNhaXuatBanData(payload);

        const result = await this.NhaXuatBan.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnDocument: "after" }
        );
        return result;
    }
    async getBy_Id(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.NhaXuatBan.findOne({ _id: new ObjectId(id) });
        return result;
    }
    // Xóa
    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const sachService = new SachService(MongoDB.client);

        const NXB = await this.getBy_Id(id);
        await sachService.deleteByMANXB(NXB.MANXB);
        const result = await this.NhaXuatBan.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = NhaXuatBanService;
