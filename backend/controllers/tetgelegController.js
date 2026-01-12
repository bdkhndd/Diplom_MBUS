const mongoose = require('mongoose');
const Tetgeleg = require('../models/tetgelegModel'); 
const Mergejil = require('../models/mergejilModel');
const getTetgeleg = async (req, res) => {
    try {
        const tetgelegList = await Tetgeleg.find({})
            .populate('meregjilId')
            .sort({ bosgo_Onoo: 1 });
        res.status(200).json({ data: tetgelegList });  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleTetgeleg = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'ID формат буруу' });
    }

    try {
        const tetgeleg = await Tetgeleg.findById(id).populate('meregjilId');
        
        if (!tetgeleg) {
            return res.status(404).json({ error: 'Тэтгэлэг олдсонгүй' });
        }
        res.status(200).json({ data: tetgeleg });  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addTetgeleg = async (req, res) => {
    const { meregjilId, teteglegNer, shaardlag, bosgo_Onoo, teteglegiin_Hemjee, hugatsaa, category } = req.body; 
    
    try {
        const newTetgeleg = await Tetgeleg.create({
            meregjilId, 
            teteglegNer, 
            shaardlag, 
            bosgo_Onoo,
            teteglegiin_Hemjee,
            hugatsaa,
            category
        });
        res.status(201).json({ data: newTetgeleg });  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTetgeleg = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID формат буруу' });
    }
    
    try {
        const tetgeleg = await Tetgeleg.findByIdAndDelete(id); 
        if (!tetgeleg) {
            return res.status(400).json({ error: 'Тэтгэлэг олдсонгүй' });
        }
        res.status(200).json({ data: tetgeleg });  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTetgeleg = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'ID формат буруу' });
    }
    
    try {
        const tetgeleg = await Tetgeleg.findByIdAndUpdate(
            id, 
            { ...req.body }, 
            { new: true, runValidators: true }
        );
        if (!tetgeleg) {
            return res.status(404).json({ error: 'Тэтгэлэг олдсонгүй' });
        }
        res.status(200).json({ data: tetgeleg });  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getTetgeleg,
    getSingleTetgeleg,
    addTetgeleg,
    deleteTetgeleg,
    updateTetgeleg,
};