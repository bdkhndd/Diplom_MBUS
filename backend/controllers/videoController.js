const mongoose = require('mongoose');
const Video = require('../models/videoModel');
const fs = require('fs'); // Файл устгахад хэрэглэгдэнэ
const path = require('path');

// GET - Бүх видео авах
const getVideo = async (req, res) => {
    try {
        const videoList = await Video.find({}).sort({ createdAt: -1 });
        res.status(200).json({ data: videoList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET - Нэг видео авах
const getSingleVideo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }
    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: 'Видео олдсонгүй.' });
        }
        res.status(200).json({ data: video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST - Шинэ видео нэмэх (Multer файлтай)
const addVideo = async (req, res) => {
    try {
        const { title, description, duration} = req.body;
        
        // Файл ирсэн эсэхийг шалгах
        if (!req.file) {
            return res.status(400).json({ error: "Видео файл олдсонгүй." });
        }

        // Windows болон Linux замын ялгааг арилгах ( \ -> / )
        const videoPath = req.file.path.replace(/\\/g, "/");

        const newVideo = await Video.create({
            title,
            description,
            videoUrl: videoPath, // Сервер дээрх хадгалагдсан зам
            duration: Number(duration) || 0,
        });

        res.status(201).json({ data: newVideo });
    } catch (error) {
        // Хэрэв баазад хадгалахад алдаа гарвал хуулагдсан файлыг устгах
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ error: error.message });
    }
};

// DELETE - Видео устгах (Файлыг серверээс давхар устгана)
const deleteVideo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: 'Видео олдсонгүй.' });
        }

        // 1. Сервер дээрх файлыг устгах
        if (video.videoUrl && fs.existsSync(video.videoUrl)) {
            fs.unlinkSync(video.videoUrl);
        }

        // 2. Баазаас устгах
        await Video.findByIdAndDelete(id);

        res.status(200).json({ message: 'Видео болон файл устгагдлаа', data: video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT - Видео шинэчлэх (Файл солигдох үед хуучныг устгана)
// PUT - Видео шинэчлэх
const updateVideo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const video = await Video.findById(id);
        if (!video) return res.status(404).json({ error: 'Видео олдсонгүй.' });

        let updateData = {
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration
        };

        if (req.file) {
            // 1. Хуучин файлыг серверээс устгах (Шинэ файл ирсэн бол)
            if (video.videoUrl && fs.existsSync(video.videoUrl)) {
                fs.unlinkSync(video.videoUrl);
            }
            // 2. Шинэ файлын замыг оноох
            updateData.videoUrl = req.file.path.replace(/\\/g, "/");
        }

        const updatedVideo = await Video.findByIdAndUpdate(id, updateData, { 
            new: true, 
            runValidators: true 
        });

        res.status(200).json({ data: updatedVideo });
    } catch (error) {
        // Алдаа гарвал шинээр хуулсан файлыг устгах
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getVideo,
    getSingleVideo,
    addVideo,
    deleteVideo,
    updateVideo,
};