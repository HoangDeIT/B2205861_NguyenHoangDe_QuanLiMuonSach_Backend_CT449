const { ObjectId, ReturnDocument } = require("mongodb");
const bcrypt = require("bcryptjs");
class StaffService {
    constructor(client) {
        this.NhanVien = client.db().collection("NhanVien");
    }

    extractNhanVienData(payload) {
        const contact = {
            HoTenNV: payload.HoTenNV,
            Password: payload.Password,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai
        };
        Object.keys(contact).forEach((key) => contact[key] === undefined && delete contact[key]);
        return contact;
    }
    async create(payload) {
        payload.Password = await bcrypt.hash(payload.Password, 10);
        const nhanVien = this.extractNhanVienData(payload);
        console.log(nhanVien);
        const result = await this.NhanVien.insertOne(nhanVien);
        return result;
    }
    async getAll(page, limit, search) {
        const query = search ? { HoTenNV: { $regex: search, $options: "i" } } : {};
        const staffs = await this.NhanVien.find(query)
            .skip((page - 1) * limit) // Bỏ qua số lượng phù hợp với trang hiện tại
            .limit(limit) // Giới hạn số lượng nhân viên trên mỗi trang
            .toArray();
        const total = await this.NhanVien.countDocuments(query);
        return {
            data: staffs,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getPhoneOne(phone) {
        return await this.NhanVien.findOne({ SoDienThoai: phone });
    }
    async update(id, payload) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }

        const nhanVien = this.extractNhanVienData(payload);
        if (nhanVien.Password && nhanVien.Password.length > 0) {
            nhanVien.Password = await bcrypt.hash(nhanVien.Password, 10);
        } else {
            delete nhanVien.Password;
        }

        const result = await this.NhanVien.findOneAndUpdate(
            { _id: new ObjectId(id) },  // Điều kiện tìm nhân viên theo ID
            { $set: nhanVien },         // Cập nhật các trường được truyền vào
            { returnDocument: "after" } // Trả về nhân viên sau khi cập nhật
        );

        return result;
    }
    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID không hợp lệ");
        }

        const result = await this.NhanVien.deleteOne({ _id: new ObjectId(id) });

        return result.deletedCount > 0; // Trả về true nếu xóa thành công, ngược lại false
    }
}
module.exports = StaffService