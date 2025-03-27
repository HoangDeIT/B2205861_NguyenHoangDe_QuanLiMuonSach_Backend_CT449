const jwt = require("jsonwebtoken");

const getUserFromToken = (token) => {
    try {
        if (!token) {
            return { error: "Token không được cung cấp!" };
        }

        // Loại bỏ tiền tố "Bearer " nếu có
        const accessToken = token.replace("Bearer ", "");

        // Giải mã token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        return decoded.MADOCGIA; // Trả về thông tin user trong token
    } catch (error) {
        return { error: "Token không hợp lệ hoặc đã hết hạn!" };
    }
};

module.exports = { getUserFromToken };