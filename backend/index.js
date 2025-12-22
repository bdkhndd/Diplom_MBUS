require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path'); 

// ===================================
// 1. ROUTES-ИЙГ ИМПОРТЛОХ (8 COLLECTIONS)
// ===================================
const Hamtarsan_hutRoutes = require('./routes/hamtarsan_hut.js');
const MergejilRoutes = require('./routes/mergejil.js');
const TenhimRoutes = require('./routes/tenhim.js');
const TetgelegRoutes = require('./routes/tetgeleg.js');
const TulburRoutes = require('./routes/tulbur.js');
const VideoRoutes = require('./routes/video.js');
const ContactInfoRoutes = require('./routes/contactinfo.js');
const FeedbackRoutes = require('./routes/feedback.js');
const statsRoutes = require('./routes/stats');

// 🚨 Express app-ийг нэг л удаа зарлах
const app = express(); 

// ===================================
// 2. MIDDLEWARE
// ===================================
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use('/uploads', express.static('uploads'));
// Console дээр хүсэлтийн замыг хэвлэх middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Үндсэн хаягт мэндчилгээ илгээх 

// ===================================
// 3. API ROUTES (8 COLLECTIONS)
// ===================================
app.use('/api/tenhim', TenhimRoutes)           // 1️⃣ Тэнхим
app.use('/api/mergejil', MergejilRoutes)       // 2️⃣ Мэргэжил
app.use('/api/hamtarsan_hut', Hamtarsan_hutRoutes) // 3️⃣ Хамтарсан Хөтөлбөр
app.use('/api/tetgeleg', TetgelegRoutes)       // 4️⃣ Тэтгэлэг
app.use('/api/tulbur', TulburRoutes)           
app.use('/api/video', VideoRoutes)             // 6️⃣ Видео
app.use('/api/contactinfo', ContactInfoRoutes) // 7️⃣ Холбоо Барих
app.use('/api/feedback', FeedbackRoutes)   
app.use('/api/stats', statsRoutes);    // 8️⃣ Санал & Үнэлгээ
app.get("/", (req, res) => {
    res.send("MBUS API Backend v2.0 - 8 Collections")
})

// ===================================
// 4. MONGODB-ТЭЙ ХОЛБОГДОХ
// ===================================
const DB_URI = process.env.MONGODB_URL || 'mongodb+srv://developer:bdkhnd0730@cluster0.sraxvis.mongodb.net/MBUSApp'
const PORT = process.env.PORT || 4000;

mongoose.connect(DB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server http://10.150.34.26:${PORT} дээр ажиллаж байна`)
        })
    })
    .catch((err) => {
        console.error("❌ Database холболтын алдаа:", err);
    })