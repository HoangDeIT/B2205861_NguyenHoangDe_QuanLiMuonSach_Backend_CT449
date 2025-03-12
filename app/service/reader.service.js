const { ObjectId } = require("mongodb");

class ReaderService {
    constructor(client) {
        this.DOCGIA = client.db().collection("DOCGIA");
    }

    extractDocGiaData(payload) {
        const docGia = {
            HOLOT: payload.HOLOT,
            TEN: payload.TEN,
            NGAYSINH: payload.NGAYSINH,
            PHAI: payload.PHAI,
            DIACHI: payload.DIACHI,
            DIENTHOAI: payload.DIENTHOAI
        };
        Object.keys(docGia).forEach((key) => docGia[key] === undefined && delete docGia[key]);
        return docGia;
    }

    async create(payload) {
        const docGia = this.extractDocGiaData(payload);
        const result = await this.DOCGIA.insertOne(docGia);
        return result;
    }

    async getAll(page, limit, search) {
        const query = search ? { DIENTHOAI: { $regex: search, $options: "i" } } : {};
        const docGias = await this.DOCGIA.find(query)
            .skip((page - 1) * limit) // Bỏ qua số lượng phù hợp với trang hiện tại
            .limit(limit) // Giới hạn số lượng độc giả trên mỗi trang
            .toArray();
        const total = await this.DOCGIA.countDocuments(query);
        return {
            data: docGias,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }

    async getPhoneOne(phone) {
        return await this.DOCGIA.findOne({ DIENTHOAI: phone });
    }

    async update(id, payload) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }

        const docGia = this.extractDocGiaData(payload);

        const result = await this.DOCGIA.findOneAndUpdate(
            { _id: new ObjectId(id) },  // Điều kiện tìm độc giả theo ID
            { $set: docGia },          // Cập nhật các trường được truyền vào
            { returnDocument: "after" } // Trả về độc giả sau khi cập nhật
        );

        return result;
    }

    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }

        const result = await this.DOCGIA.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0; // Trả về true nếu xóa thành công, ngược lại false
    }
    async getById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }
        return await this.DOCGIA.findOne({ _id: new ObjectId(id) });
    }
}

module.exports = ReaderService;
