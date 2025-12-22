const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Видео гарчиг заавал шаардлагатай.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Тайлбар заавал шаардлагатай.'],
        trim: true
    },
    videoUrl: {
        type: String,
        required: [true, 'Видео URL заавал шаардлагатай.'],
        trim: true
    },
    duration: {
        type: Number,
        required: false,
        default: 0
    },
}, { 
    timestamps: true,
    collection: 'video'
});

module.exports = mongoose.model('video', videoSchema);