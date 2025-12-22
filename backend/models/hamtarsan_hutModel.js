const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const hamtarsan_hutSchema = new Schema({
    mergejilId: {
        type: Schema.Types.ObjectId,
        ref: 'mergejil', 
        required: [true, 'Мэргэжлийн ID заавал шаардлагатай.'],
    },
    uls: {
        type: String,
        required: [true, 'Улсын нэр заавал шаардлагатай.'],
        trim: true
    },
    surguuli: {
        type: String,
        required: [true, 'Сургуулийн нэр заавал шаардлагатай.'],
    },
    hutulbur: {
        type: String,
        required: [true, 'Хөтөлбөрийн төрөл шаардлагатай.']
    },
    hugatsaa: {
        type: String,
        required: [true, 'Хугацаа (жилээр) шаардлагатай.'],
    }
}, { 
     timestamps: true,
    collection: 'hamtarsan_hut'
});
module.exports = mongoose.model('hamtarsan_hut', hamtarsan_hutSchema);