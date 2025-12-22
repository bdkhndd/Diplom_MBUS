const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tenhim = require('../models/tenhimModel'); // Тэнхим модел байгаа зам

// 1. Storage тохиргоо (Зургийг хаана, ямар нэрээр хадгалах)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/tenhim');
        // Хавтас байхгүй бол үүсгэх
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'tenhim-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Файл шүүлтүүр (Зөвхөн зураг зөвшөөрөх)
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Зөвхөн зураг файл оруулна уу!'));
        }
    }
});

/**
 * @route   GET /api/tenhim
 * @desc    Бүх тэнхимийн мэдээллийг авах
 */
router.get('/', async (req, res) => {
    try {
        const tenhims = await Tenhim.find().sort({ createdAt: -1 });
        res.status(200).json({data: tenhims});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/tenhim/:id
 * @desc    Нэг тэнхимийн мэдээллийг ID-аар авах
 */
router.get('/:id', async (req, res) => {
    try {
        const tenhim = await Tenhim.findById(req.params.id);
        if (!tenhim) return res.status(404).json({ success: false, error: 'Тэнхим олдсонгүй' });
        res.status(200).json({ success: true, data: tenhim });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/tenhim/upload
 * @desc    Шинэ тэнхим үүсгэх (2 зурагтай)
 */
router.post('/upload', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'detailImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const zurag = [];
        
        if (req.files?.['coverImage']?.[0]) {
            zurag[0] = `/uploads/tenhim/${req.files['coverImage'][0].filename}`;
        }
        if (req.files?.['detailImage']?.[0]) {
            zurag[1] = `/uploads/tenhim/${req.files['detailImage'][0].filename}`;
        }

        const tenhim = new Tenhim({
            ...req.body,
            zurag: zurag.length > 0 ? zurag : undefined,
        });

        await tenhim.save();
        res.status(201).json({ success: true, data: tenhim });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * @route   PUT /api/tenhim/:id/upload
 * @desc    Тэнхимийн мэдээлэл болон зураг шинэчлэх
 */
router.put('/:id/upload', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'detailImage', maxCount: 1 }
]), async (req, res) => {
    try {
        // 1. Засах гэж буй тэнхим байгаа эсэхийг шалгах
        const existingTenhim = await Tenhim.findById(req.params.id);
        if (!existingTenhim) {
            return res.status(404).json({ success: false, error: 'Тэнхим олдсонгүй' });
        }

        // 2. Зургийн массивыг бэлдэх
        let zurag = Array.isArray(existingTenhim.zurag) ? [...existingTenhim.zurag] : ['', ''];

        // Cover Image шинэчлэх
        if (req.files?.['coverImage']?.[0]) {
            if (zurag[0]) {
                const oldPath = path.join(__dirname, '..', zurag[0]);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            zurag[0] = `/uploads/tenhim/${req.files['coverImage'][0].filename}`;
        }

        // Detail Image шинэчлэх
        if (req.files?.['detailImage']?.[0]) {
            if (zurag[1]) {
                const oldPath = path.join(__dirname, '..', zurag[1]);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            zurag[1] = `/uploads/tenhim/${req.files['detailImage'][1].filename}`;
        }

        // 3. ӨГӨГДЛИЙГ ШИНЭЧЛЭХ (Энэ хэсэг хамгийн чухал)
        // new Tenhim биш findByIdAndUpdate ашиглана
        const updatedTenhim = await Tenhim.findByIdAndUpdate(
            req.params.id, 
            {
                ...req.body,
                zurag: zurag
            },
            { new: true, runValidators: true } // new: true нь шинэчлэгдсэн датаг буцаадаг
        );

        res.status(200).json({ success: true, data: updatedTenhim });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
});
/**
 * @route   DELETE /api/tenhim/:id
 * @desc    Тэнхим устгах (Сервер дээрх зургуудтай нь хамт)
 */
router.delete('/:id', async (req, res) => {
    try {
        const tenhim = await Tenhim.findById(req.params.id);
        if (!tenhim) {
            return res.status(404).json({ success: false, error: 'Тэнхим олдсонгүй' });
        }

        // Файлуудыг устгах
        if (tenhim.zurag && tenhim.zurag.length > 0) {
            tenhim.zurag.forEach(filePath => {
                if (filePath) {
                    const fullPath = path.join(__dirname, '..', filePath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                }
            });
        }

        await tenhim.deleteOne();
        res.status(200).json({ success: true, message: 'Амжилттай устгагдлаа' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;