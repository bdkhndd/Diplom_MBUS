const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tulburSchema = new Schema({
    terguuleh_erelttei: {
        tulbur: {
            type: Number,
            required: true
        },
        negj_temdeg: {
            type: String,
            required: true
        },
        meregjilId: [{
            type: Schema.Types.ObjectId,
            ref: 'mergejil'
        }]
    },
    busad_mergejil: {
        tulbur: {
            type: Number,
            required: true
        },
        negj_temdeg: {
            type: String,
            required: true
        },
        meregjilId: [{
            type: Schema.Types.ObjectId,
            ref: 'mergejil'
        }]
    },
    tulburiin_zadargaa: {
        zaawlSudlah_kredit: {
            type: Number,
            required: true
        },
        songonSudlah_kredit: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'MNT'
        }
    }
}, { 
    timestamps: true,
    collection: 'tulbur'
});

module.exports = mongoose.model('tulbur', tulburSchema);