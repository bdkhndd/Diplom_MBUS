const express = require('express');
const { getCounts } = require('../controllers/statsController');

const router = express.Router();

// Жишээ авсан бүтэц: /api/stats/counts зам дээр ажиллана
router.get('/counts', getCounts);

module.exports = router;