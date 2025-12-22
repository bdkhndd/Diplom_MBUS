const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getVideo,
    getSingleVideo,
    addVideo,
    deleteVideo,
    updateVideo
} = require('../controllers/videoController');
const videoModel = require('../models/videoModel');

// --- MULTER ТОХИРГОО ЭХЛЭЛ ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/'); // Файл хадгалах хавтас
    },
    filename: (req, file, cb) => {
        // Файлын нэрийг давхцахгүй байхаар тохируулах (timestamp + random)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Зөвхөн видео файл зөвшөөрөх шүүлтүүр
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Зөвхөн видео файл хуулах боломжтой!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // Максимум 100MB
});
// --- MULTER ТОХИРГОО ТӨГСГӨЛ ---

// ROUTES
router.get('/', getVideo);
router.get('/:id', getSingleVideo);

// POST - Шинэ видео нэмэх (upload.single('video') нэмсэн)
router.post('/', upload.single('video'), addVideo);

// PUT - Видео засах (Хэрэв шинэ видео файл сонговол солигдоно)
router.put('/:id', upload.single('video'), updateVideo);

router.delete('/:id', deleteVideo);

module.exports = router;