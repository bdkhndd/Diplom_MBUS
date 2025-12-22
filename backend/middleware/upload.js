const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/images/tenhim')); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'tenhim-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Зөвхөн JPEG/JPG болон PNG файл оруулна уу!'), false);
        }
    }
});
const tenhimImageUpload = upload.single('zurag'); 

module.exports = tenhimImageUpload;