const mongoose = require('mongoose');
const Tulbur = require('../models/tulburModel');

const getTulbur = async (req, res) => {
    try {
        const tulburList = await Tulbur.find({})
            .sort({ createdAt: -1 })
            .populate('terguuleh_erelttei.meregjilId')
            .populate('busad_mergejil.meregjilId');
        
        res.status(200).json(tulburList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleTulbur = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const tulbur = await Tulbur.findById(id)
            .populate('terguuleh_erelttei.meregjilId')
            .populate('busad_mergejil.meregjilId');

        if (!tulbur) {
            return res.status(404).json({ error: 'Төлбөрийн мэдээлэл олдсонгүй.' });
        }
        res.status(200).json(tulbur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addTulbur = async (req, res) => {
    const { terguuleh_erelttei, busad_mergejil, tulburiin_zadargaa } = req.body;

    try {
        const newTulbur = await Tulbur.create({
            terguuleh_erelttei,
            busad_mergejil,
            tulburiin_zadargaa
        });
        res.status(200).json(newTulbur);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTulbur = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const tulbur = await Tulbur.findByIdAndDelete(id);
        if (!tulbur) {
            return res.status(400).json({ error: 'Төлбөрийн мэдээлэл олдсонгүй.' });
        }
        res.status(200).json({ message: 'Амжилттай устгагдлаа', deletedData: tulbur });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTulbur = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const tulbur = await Tulbur.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!tulbur) {
            return res.status(404).json({ error: 'Төлбөрийн мэдээлэл олдсонгүй.' });
        }
        res.status(200).json(tulbur);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getTulbur,
    getSingleTulbur,
    addTulbur,
    deleteTulbur,
    updateTulbur
};