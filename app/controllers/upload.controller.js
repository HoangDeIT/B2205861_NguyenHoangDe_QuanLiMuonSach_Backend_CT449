// controllers/uploadController.js

exports.uploadImage = (req, res) => {
    console.log(req);
    if (!req.file) {
        return res.status(400).json({ message: "Vui lòng chọn ảnh" });
    }

    // Trả về URL ảnh
    res.json({ imageUrl: `${req.file.filename}` });
};
