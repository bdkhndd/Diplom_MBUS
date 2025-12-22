const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tenhimSchema = new Schema({
    ner: {
        type: String,
        required: [true, 'Тэнхимийн нэр заавал шаардлагатай.'],
        trim: true
    },
    tergvvleh_chiglel: {
        type: String,
        required: false,
    },
    shagnal: {
        type: String, 
        required: false,
    },
    zurag: {
        type: [String],
        required: false,
        default: []  
    },
    bvteel: {
        type: String,
        required: false,
    },
    tailbar: {
        type: String,
        required: false,
    }
}, { 
    timestamps: true ,
    collection: 'tenhim'
});
module.exports = mongoose.model('Tenhim', tenhimSchema);