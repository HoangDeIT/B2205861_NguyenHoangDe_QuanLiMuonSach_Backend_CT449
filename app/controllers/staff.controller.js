const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const StaffService = require("../service/staff.service");

exports.create = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.create(req.body);
        return res.send(document)
    } catch (error) {
        return res.send({ message: "loi" });
    }
    return res.send({ message: "Staff was created successfully" });
}
exports.findAll = async (req, res) => {
    const service = new StaffService(MongoDB.client);
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const staffs = await service.getAll(pageNumber, pageSize, search);
    res.json(staffs);
};
exports.updateById = async (req, res) => {
    try {
        const service = new StaffService(MongoDB.client);
        const staff = await service.update(req.body._id, req.body);
        res.json(staff);
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi cập nhật nhân viên" });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const service = new StaffService(MongoDB.client);
        const staff = await service.delete(req.params.id);
        res.json(staff);
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi xóa nhân viên" });
    }
};
