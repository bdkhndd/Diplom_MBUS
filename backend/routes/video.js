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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

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
    limits: { fileSize: 200 * 1024 * 1024 } //100MB
});

router.get('/', getVideo);
router.get('/:id', getSingleVideo);


router.post('/', upload.single('video'), addVideo);

router.put('/:id', upload.single('video'), updateVideo);

router.delete('/:id', deleteVideo);

module.exports = router;