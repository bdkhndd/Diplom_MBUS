const mongoose = require('mongoose');
const Mergejil = require('../models/mergejilModel'); 
const getMergejil = async (req, res) => {
    const mergejilList = await Mergejil.find({})
        .sort({ createdAt: -1 })
        .populate('tenhimId'); 
    res.status(200).json({ data: mergejilList }); 
};
const getSingleMergejil = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    const mergejil = await Mergejil.findById(id).populate('tenhimId');
        
    if (!mergejil) {
        return res.status(404).json({ error: 'Ийм мэргэжил олдсонгүй.' });
    }
    res.status(200).json(mergejil);
};
const addMergejil = async (req, res) => {
    const {
        tenhimId,
        mergejil_Kod,
        mergejil_Ner,
        tailbar,
        sudlah_kredit,
        suraltsah_hugatsaa,
        minScore,
        hicheeluud
    } = req.body; 
    
    try {
        const newMergejil = await Mergejil.create({
            tenhimId,
            mergejil_Kod,
            mergejil_Ner,
            tailbar,
            sudlah_kredit,
            suraltsah_hugatsaa,
            minScore,
            hicheeluud
        });
         res.status(200).json({ data: newMergejil });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Мэргэжлийн код давхацсан байна.' });
        }
        res.status(400).json({ error: error.message });
    }
};
const deleteMergejil = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Зөв ID биш байна.' });
    }
    const mergejil = await Mergejil.findByIdAndDelete(id); 
    if (!mergejil) {
        return res.status(400).json({ error: 'Ийм мэргэжил олдсонгүй.' });
    }
    res.status(200).json(mergejil);
};
const updateMergejil = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }
    const mergejil = await Mergejil.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!mergejil) {
        return res.status(404).json({ error: 'Ийм мэргэжил олдсонгүй.' });
    }
    res.status(200).json(mergejil);
};
module.exports = {
    getMergejil,
    getSingleMergejil,
    addMergejil,
    deleteMergejil,
    updateMergejil,
};