const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Import UUID

// Storage engine (for local uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images")); // Ensure correct absolute path
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // Use UUID for unique filenames
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    return extName && mimeType ? cb(null, true) : cb(new Error("Only images (jpg, png) and PDFs are allowed"));
};

// Multer upload instance
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter
});

module.exports = upload;
