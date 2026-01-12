require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path'); 

const Hamtarsan_hutRoutes = require('./routes/hamtarsan_hut.js');
const MergejilRoutes = require('./routes/mergejil.js');
const TenhimRoutes = require('./routes/tenhim.js');
const TetgelegRoutes = require('./routes/tetgeleg.js');
const TulburRoutes = require('./routes/tulbur.js');
const VideoRoutes = require('./routes/video.js');
const ContactInfoRoutes = require('./routes/contactinfo.js');
const FeedbackRoutes = require('./routes/feedback.js');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/authRoutes');




const app = express(); 

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/tenhim', TenhimRoutes)
app.use('/api/mergejil', MergejilRoutes)
app.use('/api/hamtarsan_hut', Hamtarsan_hutRoutes) 
app.use('/api/tetgeleg', TetgelegRoutes)
app.use('/api/tulbur', TulburRoutes)           
app.use('/api/video', VideoRoutes)             
app.use('/api/contactinfo', ContactInfoRoutes) 
app.use('/api/feedback', FeedbackRoutes)   
app.use('/api/stats', statsRoutes);  
app.use('/api/auth', authRoutes);  
app.get("/", (req, res) => {
    res.send("MBUS API Backend v2.0 - 8 Collections")
})
const DB_URI = process.env.MONGODB_URL || 'mongodb+srv://developer:bdkhnd0730@cluster0.sraxvis.mongodb.net/MBUSApp'
const PORT = process.env.PORT || 4000;

mongoose.connect(DB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server http://192.168.1.3:${PORT} дээр ажиллаж байна`)
        })
    })
    .catch((err) => {
        console.error("Database холболтын алдаа:", err);
    })