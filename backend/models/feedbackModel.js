const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Нэр заавал шаардлагатай.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'И-мэйл заавал шаардлагатай.'],
        match: [/.+@.+\..+/, 'Зөв и-мэйл оруулна уу'],
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Сэдэв заавал шаардлагатай.'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Мессэж заавал шаардлагатай.'],
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    adminNote: {
        type: String,
        required: false,
        trim: true
    },
    attachments: [{
        type: String // URL массив
    }]
}, { 
    timestamps: true,
    collection: 'feedback'
});

module.exports = mongoose.model('feedback', feedbackSchema);