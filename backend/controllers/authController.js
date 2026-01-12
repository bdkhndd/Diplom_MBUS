const Admin = require('../models/Admin');

// @desc    Админ нэвтрэх
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'Нэвтрэх нэр болон нууц үгээ оруулна уу' 
            });
        }

        const admin = await Admin.findOne({ username }).select('+password');

        if (!admin) {
            return res.status(401).json({ 
                success: false,
                error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна' 
            });
        }

        const isPasswordCorrect = await admin.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ 
                success: false,
                error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна' 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                username: admin.username,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Сервер дээр алдаа гарлаа' 
        });
    }
};