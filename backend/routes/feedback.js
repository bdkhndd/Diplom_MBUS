const express = require('express');
const Feedback = require('../models/feedbackModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json({ data: feedbacks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ error: 'Санал олдсонгүй' });
        }
        res.json({ data: feedback });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Үндсэн талбарыг бөглөнө үү' });
        }

        const feedback = new Feedback({
            name,
            email,
            phone,
            subject,
            message,
            status: 'new',
            priority: 'medium'
        });

        await feedback.save();
        res.status(201).json({ data: feedback });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!feedback) {
            return res.status(404).json({ error: 'Санал олдсонгүй' });
        }
        res.json({ data: feedback });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ error: 'Санал олдсонгүй' });
        }
        res.json({ message: 'Санал устгагдлаа' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;