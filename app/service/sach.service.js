const { ObjectId } = require("mongodb");

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
        const doc = this.extractSachData(payload);
        const result = await this.Sach.insertOne(doc);
        return result;
    }

    async getAll(page, limit, search) {
        const query = search ? { TENSACH: { $regex: search, $options: "i" } } : {};
        const skip = (page - 1) * limit;

        const docs = await this.Sach.find(query)
            .skip(skip)
            .limit(limit)
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

    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.Sach.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
    async getAllNoPagination() {
        return await this.Sach.find({ SOQUYEN: { $gt: 0 } }).toArray();
    }
    async getById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.Sach.findOne({ _id: new ObjectId(id) });
        return result;
    }
    async updateQuantity(id, delta) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        const result = await this.Sach.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { SOQUYEN: delta } },
            { returnDocument: "after" }
        );

        return result;
    }
}

module.exports = SachService;
