const mongoose = require('mongoose');
const HamtarsanHut = require('../models/hamtarsan_hutModel'); 

const getHamtarsanHut = async (req, res) => {
    try {
        const hutulburList = await HamtarsanHut.find({})
            .sort({ createdAt: -1 })
            .populate('mergejilId'); 
        
        res.status(200).json({ data: hutulburList });  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleHamtarsanHut = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'ID формат буруу' });
    }

    try {
        const hutulbur = await HamtarsanHut.findById(id).populate('mergejilId');
        
        if (!hutulbur) {
            return res.status(404).json({ error: 'Хамтарсан хөтөлбөр олдсонгүй' });
        }
        res.status(200).json({ data: hutulbur }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addHamtarsanHut = async (req, res) => {
    const { mergejilId, uls, surguuli, hutulbur, hugatsaa } = req.body; 
    
    try {
        const newHutulbur = await HamtarsanHut.create({
            mergejilId, 
            uls, 
            surguuli, 
            hutulbur, 
            hugatsaa
        });
        res.status(201).json({ data: newHutulbur }); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteHamtarsanHut = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID формат буруу' });
    }
    
    try {
        const hutulbur = await HamtarsanHut.findByIdAndDelete(id); 
        if (!hutulbur) {
            return res.status(400).json({ error: 'Хөтөлбөр олдсонгүй' });
        }
        res.status(200).json({ data: hutulbur }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateHamtarsanHut = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'ID формат буруу' });
    }
    
    try {
        const hutulbur = await HamtarsanHut.findByIdAndUpdate(
            id, 
            { ...req.body }, 
            { new: true, runValidators: true }
        ); 
        if (!hutulbur) {
            return res.status(404).json({ error: 'Хөтөлбөр олдсонгүй' });
        }
        res.status(200).json({ data: hutulbur });  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getHamtarsanHut,
    getSingleHamtarsanHut,
    addHamtarsanHut,
    deleteHamtarsanHut,
    updateHamtarsanHut,
};