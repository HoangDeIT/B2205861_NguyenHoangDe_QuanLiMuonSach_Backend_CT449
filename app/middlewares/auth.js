const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware kiểm tra token
// function authenticateToken(req, res, next) {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: "Token không hợp lệ!" });

//         req.user = user; // Lưu thông tin user từ token vào request
//         next();
//     });
// }

function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token không hợp lệ!" });
        }

        // Xác định loại người dùng dựa trên token
        if (decoded.MANV) {
            req.user = { type: "admin", id: decoded.MANV };
        } else if (decoded.MADOCGIA) {
            req.user = { type: "user", id: decoded.MADOCGIA };
        } else {
            return res.status(403).json({ message: "Token không hợp lệ!" });
        }

        next();
    });
}

module.exports = authenticateToken;
