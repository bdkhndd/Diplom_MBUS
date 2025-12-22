const express = require('express');
const router = express.Router();
const {
    getContactInfo,
    getSingleContactInfo,
    addContactInfo,
    deleteContactInfo,
    updateContactInfo
} = require('../controllers/contactinfoController'); 

router.get('/', getContactInfo);

router.get('/:id', getSingleContactInfo);

router.post('/', addContactInfo);

router.delete('/:id', deleteContactInfo);

router.put('/:id', updateContactInfo);

module.exports = router;