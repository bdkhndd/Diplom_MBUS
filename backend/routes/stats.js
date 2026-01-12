const express = require('express');
const { getCounts } = require('../controllers/statsController');

const router = express.Router();

router.get('/counts', getCounts);

module.exports = router;