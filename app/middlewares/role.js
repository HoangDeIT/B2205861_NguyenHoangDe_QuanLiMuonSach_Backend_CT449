function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.type)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
        }
        next();
    };
}

module.exports = authorizeRole;
