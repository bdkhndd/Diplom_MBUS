const Feedback = require('../models/feedbackModel');
const Tenhim = require('../models/tenhimModel');
const Mergejil = require('../models/mergejilModel');
const Tetgeleg = require('../models/tetgelegModel');
const Hamtarsan_hut = require('../models/hamtarsan_hutModel');
const Contact = require('../models/contactinfoModel');
const Tulbur = require('../models/tulburModel');
const Video = require('../models/videoModel');

// @desc    Бүх статистик тоог авах
// @route   GET /api/stats/counts
const getCounts = async (req, res) => {
    try {
       
        const [
            feedback, 
            tenhim, 
            mergejil, 
            tetgeleg, 
            hamtarsan_hut, 
            contact, 
            tulbur, 
            video
        ] = await Promise.all([
            Feedback.countDocuments(),
            Tenhim.countDocuments(),
            Mergejil.countDocuments(),
            Tetgeleg.countDocuments(),
            Hamtarsan_hut.countDocuments(), 
            Contact.countDocuments(),       
            Tulbur.countDocuments(),        
            Video.countDocuments()          
        ]);

        res.status(200).json({
            success: true,
            data: {
                feedback,
                tenhim,
                mergejil,
                tetgeleg,
                hamtarsan: hamtarsan_hut, 
                tulbur,
                video,
                contact
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getCounts
};