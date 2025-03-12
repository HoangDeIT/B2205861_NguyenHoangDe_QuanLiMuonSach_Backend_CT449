const { ObjectId } = require("mongodb");

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
        const doc = this.extractNhaXuatBanData(payload);
        const result = await this.NhaXuatBan.insertOne(doc);
        return result;
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

    // Xóa
    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.NhaXuatBan.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}

module.exports = NhaXuatBanService;
