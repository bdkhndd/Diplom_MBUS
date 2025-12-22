const express = require('express');
const Tulbur = require('../models/tulburModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tulbur = await Tulbur.find()
            .populate('terguuleh_erelttei.meregjilId')
            .populate('busad_mergejil.meregjilId')
            .sort({ createdAt: -1 });
        res.json({ data: tulbur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tulbur = await Tulbur.findById(req.params.id)
            .populate('terguuleh_erelttei.meregjilId')
            .populate('busad_mergejil.meregjilId');
        
        if (!tulbur) {
            return res.status(404).json({ error: 'Түлбүр олдсонгүй' });
        }
        res.json({ data: tulbur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST шинэ түлбүр
router.post('/', async (req, res) => {
    try {
        const tulbur = new Tulbur(req.body);
        await tulbur.save();
        await tulbur.populate('terguuleh_erelttei.meregjilId');
        await tulbur.populate('busad_mergejil.meregjilId');
        res.status(201).json({ data: tulbur });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT түлбүр шинэчлэх
router.put('/:id', async (req, res) => {
    try {
        const tulbur = await Tulbur.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('terguuleh_erelttei.meregjilId')
         .populate('busad_mergejil.meregjilId');
        
        if (!tulbur) {
            return res.status(404).json({ error: 'Түлбүр олдсонгүй' });
        }
        res.json({ data: tulbur });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const tulbur = await Tulbur.findByIdAndDelete(req.params.id);
        if (!tulbur) {
            return res.status(404).json({ error: 'Төлбөр олдсонгүй' });
        }
        res.json({ message: 'Төлбөр устгагдлаа' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;