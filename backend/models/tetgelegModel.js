const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tetgelegSchema = new Schema({
    meregjilId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'mergejil' }],
    teteglegNer: {
        type: String,
        required: [true, 'Тэтгэлгийн нэр заавал шаардлагатай.'],
        trim: true
    },
    shaardlag: {
        type: String,
        required: [true, 'Шаардлага заавал шаардлагатай.'],
    },
    bosgo_Onoo: {
        type: Number,
        required: [true, 'Босго оноо заавал шаардлагатай.'],
    },
    teteglegiin_Hemjee: {
        type: String,
        required: [true, 'Тэтгэлгийн мөнгөн хэмжээ заавал шаардлагатай.'],
    },
    hugatsaa: {
        type: String,
        required: [true, 'Тэтгэлгийн хугацаа заавал шаардлагатай.'],
    },
    category: {
         type: String,
        required: [true, 'category заавал шаардлагатай.'],
    }
}, { 
    timestamps: true ,
    collection: 'tetgeleg'
});
module.exports = mongoose.model('tetgeleg', tetgelegSchema);