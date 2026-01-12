const mongoose = require('mongoose');
const Feedback = require('../models/feedbackModel');

const getFeedbacks = async (req, res) => {
    try {
        const feedbackList = await Feedback.find({})
            .sort({ createdAt: -1 });
        res.status(200).json(feedbackList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleFeedback = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ error: 'Санал хүсэлт олдсонгүй.' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createFeedback = async (req, res) => {
    const { name, email, phone, subject, message, attachments } = req.body;

    try {
        const newFeedback = await Feedback.create({
            name,
            email,
            phone,
            subject,
            message,
            attachments
        });
        res.status(200).json(newFeedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteFeedback = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return res.status(400).json({ error: 'Санал хүсэлт олдсонгүй.' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateFeedback = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const feedback = await Feedback.findByIdAndUpdate(
            id, 
            { ...req.body }, 
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ error: 'Санал хүсэлт олдсонгүй.' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getFeedbacks,
    getSingleFeedback,
    createFeedback,
    deleteFeedback,
    updateFeedback
};