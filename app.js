const express = require('express');
const cors = require('cors');
const staffsRouter = require("./app/routes/staff.route")
const readerRouter = require("./app/routes/reader.router")
const nhaXuatBanRouter = require("./app/routes/nhaXuatBan.routes");
const sachRouter = require("./app/routes/sach.routes");
const theoDoiMuonSachRouter = require("./app/routes/theoDoiMuonSach.routes");

const ApiError = require("./app/api-error");
const authenticateToken = require('./app/middlewares/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application" });
})
app.use("/api/v1/auth", require("./app/routes/auth.route"));
// app.use(authenticateToken);
app.use("/api/v1/staff", staffsRouter)
app.use("/api/v1/reader", readerRouter)
app.use("/api/v1/nxb", nhaXuatBanRouter);
app.use("/api/v1/sach", sachRouter);
app.use("/api/v1/muon", theoDoiMuonSachRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
})
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"

    })
})
module.exports = app;
