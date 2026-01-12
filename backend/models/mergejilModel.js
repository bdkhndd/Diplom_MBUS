const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mergejilSchema = new Schema({
    tenhimId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenhim', 
        required: [true, 'Тэнхимийн ID заавал шаардлагатай.'],
    },
    mergejil_Kod: {
        type: String,
        required: [true, 'Мэргэжлийн код заавал шаардлагатай.'],
        unique: true 
    },
    mergejil_Ner: {
        type: String,
        required: [true, 'Мэргэжлийн чиглэлийн нэр заавал шаардлагатай.'],
    },
    tailbar: {
        type: String,
        required: false,
    },
    sudlah_kredit: {
        type: Number,
        required: [true, 'Судлах кредит оруулах шаардлагатай.']
    },

    suraltsah_hugatsaa: {
        type: String,
        required: [true, 'Суралцах хугацаа оруулах шаардлагатай.']
    },
    minScore: {
        type: Number,
        required: [true, 'Элсэхэд шаардагдах хамгийн бага оноо заавал шаардлагатай.'],
    },
    hicheeluud: [
        {
            code: { type: String, required: true },     
            name: { type: String, required: true },     
            type: { 
                type: String, 
                enum: ['main', 'secondary'],            
                required: true 
            }
        }
    ]

}, 
 { 
    timestamps: true ,
    collection: 'mergejil'
});
module.exports = mongoose.model('mergejil', mergejilSchema);