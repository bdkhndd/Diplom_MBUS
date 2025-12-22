const mongoose = require('mongoose');
const Tenhim = require('../models/tenhimModel'); 
const getTenhim = async (req, res) => {
    const tenhimList = await Tenhim.find({}).sort({ createdAt: -1 }); 
    res.status(200).json({ data: tenhimList }); 
};
const getSingleTenhim = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    const tenhim = await Tenhim.findById(id);
        
    if (!tenhim) {
        return res.status(404).json({ error: 'Ийм тэнхим олдсонгүй.' });
    }
    res.status(200).json(tenhim);
};
const addTenhim = async (req, res) => {
    const { ner, tergvvleh_chiglel, shagnal, zurag, bvteel, tailbar } = req.body; 
    
    try {
        const newTenhim = await Tenhim.create({
            ner, 
            tergvvleh_chiglel, 
            shagnal, 
            zurag: Array.isArray(zurag) ? zurag : [],
            bvteel,
            tailbar
        });
        res.status(200).json ({data: newTenhim});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const deleteTenhim = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Зөв ID биш байна.' });
    }
    const tenhim = await Tenhim.findByIdAndDelete(id); 
    if (!tenhim) {
        return res.status(400).json({ error: 'Ийм тэнхим олдсонгүй.' });
    }
    res.status(200).json(tenhim);
};
const updateTenhim = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }
    const tenhim = await Tenhim.findByIdAndUpdate(id, { ...req.body }, { new: true });
    if (!tenhim) {
        return res.status(404).json({ error: 'Ийм тэнхим олдсонгүй.' });
    }
    res.status(200).json(tenhim);
};
module.exports = {
    getTenhim,
    getSingleTenhim,
    addTenhim,
    deleteTenhim,
    updateTenhim,
};