const { ObjectId } = require("mongodb");
const TheoDoiMuonSachService = require("./theoDoiMuonSach.service");
const MongoDB = require("../utils/mongodb.util");


class SachService {
    constructor(client) {
        this.Sach = client.db().collection("SACH");
    }

    extractSachData(payload) {
        const doc = {
            TENSACH: payload.TENSACH,
            DONGIA: payload.DONGIA,
            SOQUYEN: payload.SOQUYEN,
            NAMXUATBAN: payload.NAMXUATBAN,
            MANXB: payload.MANXB,
            NGUONGOC_TACGIA: payload.NGUONGOC_TACGIA,
            IMAGEURL: payload.IMAGEURL
        };
        Object.keys(doc).forEach((key) => doc[key] === undefined && delete doc[key]);
        return doc;
    }

    async create(payload) {
        const session = await this.Sach.client.startSession();
        try {
            session.startTransaction();

            const doc = this.extractSachData(payload);
            // Lọc các mã sách theo format "S[Number]"
            const sachList = await this.Sach.find({ MASACH: /^S\d+$/ }).toArray();

            // Chuyển tất cả MASACH thành số
            const maxNumber = sachList
                .map(item => parseInt(item.MASACH.replace("S", ""), 10)) // Chuyển về số
                .filter(num => !isNaN(num)) // Bỏ giá trị không hợp lệ
                .reduce((max, num) => Math.max(max, num), 0); // Tìm số lớn nhất
            doc.MASACH = `S${maxNumber + 1}`;

            const result = await this.Sach.insertOne(doc, { session });
            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAll(page, limit, search, MANXB, sort) {
        const query = {
            ...(search && { TENSACH: { $regex: search, $options: "i" } }), // Tìm kiếm theo TENSACH
            ...(MANXB && { MANXB: { $in: Array.isArray(MANXB) ? MANXB : [MANXB] } }) // Lọc theo nhiều NXB
        };
        console.log(query)
        const skip = (page - 1) * limit;
        const sortOption = { DONGIA: sort === "asc" ? 1 : -1 }; // 1 là tăng dần, -1 là giảm dần

        const docs = await this.Sach.find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOption)
            .toArray();

        const total = await this.Sach.countDocuments(query);
        return {
            data: docs,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getAllNoPagination() {
        return await this.Sach.find({}).toArray();
    }
    async update(id, payload) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const doc = this.extractSachData(payload);

        const result = await this.Sach.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: doc },
            { returnDocument: "after" }
        );
        return result;
    }
    async getBy_Id(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error("ID không hợp lệ");
        // }
        const result = await this.Sach.findOne({ _id: new ObjectId(id) });
        return result;
    }
    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client)
        const sach = await this.getBy_Id(id);


        const result = await this.Sach.deleteOne({ _id: new ObjectId(id) });
        await theoDoiMuonSachService.deleteByMASACH(sach.MASACH);
        return result.deletedCount > 0;
    }
    async getAllNoPagination() {
        return await this.Sach.find({ SOQUYEN: { $gt: 0 } }).toArray();
    }

    async getById(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error("ID không hợp lệ");
        // }
        const result = await this.Sach.findOne({ MASACH: id });
        return result;
    }
    async updateQuantity(id, delta) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error("ID không hợp lệ");
        // }
        const result = await this.Sach.findOneAndUpdate(
            { MASACH: id },
            { $set: { SOQUYEN: delta } },
            { returnDocument: "after" }
        );

        return result;
    }

    async deleteByMANXB(MANXB) {
        const sachList = await this.Sach.find({ MANXB }).toArray();
        const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client)

        await Promise.all(sachList.map(sach => theoDoiMuonSachService.deleteByMASACH(sach.MASACH)));

        const result = await this.Sach.deleteMany({ MANXB });
        return result.deletedCount > 0;
    }
}

module.exports = SachService;
