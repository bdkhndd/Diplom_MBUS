const mongoose = require('mongoose');
const ContactInfo = require('../models/contactinfoModel');

// GET - Бүх холбоо барих мэдээлэл авах
const getContactInfo = async (req, res) => {
    try {
        const contactList = await ContactInfo.find({}).sort({ createdAt: -1 });
        res.status(200).json({ data: contactList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET - Нэг холбоо барих мэдээлэл авах
const getSingleContactInfo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const contact = await ContactInfo.findById(id);
        if (!contact) {
            return res.status(404).json({ error: 'Холбоо барих мэдээлэл олдсонгүй.' });
        }
        res.status(200).json({ data: contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST - Шинэ холбоо барих мэдээлэл нэмэх
const addContactInfo = async (req, res) => {
    const { 
        phone, email, website, address, 
        facebook, instagram, twitter, linkedin,
        workingHours, departments, emergencyContacts, location, isActive 
    } = req.body;

    try {
        const newContact = await ContactInfo.create({
            phone,
            email,
            website,
            address,
            facebook,
            instagram,
            twitter,
            linkedin,
            workingHours,
            departments,
            emergencyContacts,
            location,
            isActive: isActive !== undefined ? isActive : true
        });
        res.status(201).json({ data: newContact });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE - Холбоо барих мэдээлэл устгах
const deleteContactInfo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const contact = await ContactInfo.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ error: 'Холбоо барих мэдээлэл олдсонгүй.' });
        }
        res.status(200).json({ message: 'Холбоо барих мэдээлэл устгагдлаа', data: contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT - Холбоо барих мэдээлэл шинэчлэх
const updateContactInfo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Зөв ID биш байна.' });
    }

    try {
        const contact = await ContactInfo.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });
        if (!contact) {
            return res.status(404).json({ error: 'Холбоо барих мэдээлэл олдсонгүй.' });
        }
        res.status(200).json({ data: contact });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getContactInfo,
    getSingleContactInfo,
    addContactInfo,
    deleteContactInfo,
    updateContactInfo,
};