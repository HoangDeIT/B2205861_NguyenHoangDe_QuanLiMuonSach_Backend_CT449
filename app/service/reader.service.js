const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const TheoDoiMuonSachService = require("./theoDoiMuonSach.service");
const MongoDB = require("../utils/mongodb.util");

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
            DIENTHOAI: payload.DIENTHOAI,
            Password: payload.Password,
        };
        Object.keys(docGia).forEach((key) => docGia[key] === undefined && delete docGia[key]);
        return docGia;
    }

    async create(payload) {
        const session = await this.DOCGIA.client.startSession();
        try {
            session.startTransaction();
            payload.Password = await bcrypt.hash(payload.Password, 10);
            const docGia = this.extractDocGiaData(payload);

            const maxDocGia = await this.DOCGIA.find({ MADOCGIA: /^D\d+$/ }).toArray();
            const maxNumber = maxDocGia
                .map(item => parseInt(item.MADOCGIA.replace("D", ""), 10))
                .filter(num => !isNaN(num))
                .reduce((max, num) => Math.max(max, num), 0);

            docGia.MADOCGIA = `D${maxNumber + 1}`;
            const result = await this.DOCGIA.insertOne(docGia, { session });
            await session.commitTransaction();
            return result;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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
        if (docGia.Password && docGia.Password.length > 0) {
            docGia.Password = await bcrypt.hash(docGia.Password, 10);
        } else {
            delete docGia.Password;
        }
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

        const docgia = this.getBy_Id(id);
        const theoDoiMuonSachService = new TheoDoiMuonSachService(MongoDB.client);
        await theoDoiMuonSachService.deleteByMADOCGIA(docgia.MADOCGIA);

        const result = await this.DOCGIA.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0; // Trả về true nếu xóa thành công, ngược lại false
    }
    async getById(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error("ID không hợp lệ");
        // }
        const result = await this.DOCGIA.findOne({ MADOCGIA: id });
        console.log(result)
        return result;
    }
    async getBy_Id(id) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error("ID không hợp lệ");
        // }
        return await this.DOCGIA.findOne({ _id: new ObjectId(id) });
    }
    async changePassword(id, password) {
        // if (!ObjectId.isValid(id)) {
        //     throw new Error("ID không hợp lệ");
        // }
        const result = await this.DOCGIA.findOneAndUpdate({ MADOCGIA: id }, { $set: { Password: password } }, { returnDocument: "after" });
        return result;
    }

}

module.exports = ReaderService;
