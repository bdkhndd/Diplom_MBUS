const express = require('express');
const mongoose = require('mongoose'); 
const {
    getMergejil,
    getSingleMergejil,
    addMergejil,
    deleteMergejil,
    updateMergejil,
} = require('../controllers/mergejilController');

const router = express.Router();

const Mergejil = require('../models/mergejilModel'); 
const Tetegleg = require('../models/tetgelegModel');
const HamtarsanHutulbur = require('../models/hamtarsan_hutModel');

router.get('/full/:id', async (req, res) => {
    try {
        const mergejilId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(mergejilId)) {
            return res.status(400).json({ message: 'Хүчингүй ID-ийн формат.' });
        }

        const mergejil = await Mergejil.findById(mergejilId).populate('tenhimId');
        if (!mergejil) {
            return res.status(404).json({ message: 'Мэргэжил олдсонгүй.' });
        }

        const tetegleg = await Tetegleg.find({ mergejilId: mergejilId }); 
        const hamtarsanHutulbur = await HamtarsanHutulbur.find({ mergejilId: mergejilId }); 
        const dadlaga = await Dadlaga.find({ mergejilId: mergejilId });

        res.json({
            mergejil,
            tetegleg,
            hamtarsanHutulbur,
        });

    } catch (err) {
        console.error('❌ /full/:id route error:', err);
        res.status(500).json({ message: 'Дэлгэрэнгүй мэдээлэл татахад алдаа гарлаа: ' + err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const mergejil = await Mergejil.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!mergejil) {
            return res.status(404).json({ error: 'Мэргэжил олдсонгүй' });
        }

        res.status(200).json({
            data: mergejil,
            message: 'Мэргэжил амжилттай шинэчлэгдлээ'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', getMergejil);

router.get('/:id', getSingleMergejil);

router.post('/', addMergejil);

router.delete('/:id', deleteMergejil);

module.exports = router;
