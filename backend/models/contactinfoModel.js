const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactInfoSchema = new Schema({
    phone: {
        type: String,
        required: [true, 'Утасны дугаар заавал шаардлагатай.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'И-мэйл хаяг заавал шаардлагатай.'],
        trim: true,
        match: [/.+@.+\..+/, 'Зөв и-мэйл оруулна уу']
    },
    website: {
        type: String,
        required: [true, 'Вэб хаяг заавал шаардлагатай.'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Хаяг заавал шаардлагатай.'],
        trim: true
    },
    facebook: {
        type: String,
        required: false,
        trim: true
    },
    instagram: {
        type: String,
        required: false,
        trim: true
    },
    twitter: {
        type: String,
        required: false,
        trim: true
    },
    linkedin: {
        type: String,
        required: false,
        trim: true
    },
    workingHours: {
        weekdays: {
            type: String,
            required: true,
            default: '09:00 - 18:00'
        },
        weekend: {
            type: String,
            required: true,
            default: 'Амарна'
        }
    },
    departments: [{
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        }
    }],
    emergencyContacts: [{
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    }],
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true,
    collection: 'contactinfos'
});

module.exports = mongoose.model('contactinfo', contactInfoSchema);