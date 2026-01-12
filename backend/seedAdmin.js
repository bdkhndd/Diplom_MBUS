const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://developer:bdkhnd0730@cluster0.sraxvis.mongodb.net/MBUSApp');
        
        console.log('🔌 MongoDB холбогдлоо...');

        // Өмнө байгаа админуудыг устгах
        await Admin.deleteMany({});
        
        // Шинэ админууд үүсгэх
        const admins = await Admin.create([
            {
                username: 'admin',
                password: 'admin123',
                role: 'Super Admin'
            },
            {
                username: 'teacher',
                password: 'teacher123',
                role: 'Teacher'
            }
        ]);

        console.log('✅ Админууд амжилттай үүсгэгдлээ:');
        admins.forEach(admin => {
            console.log(`   - ${admin.username} / ${admin.role}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Алдаа:', error);
        process.exit(1);
    }
};

seedAdmin();