// services/calculatorService.ts

import { ApiResponse, MergejilType, TetgelegType, LessonType } from './types'; 
import { getAllMergejil } from './mergejilService';
import { getTetgeleg } from './tetgelegService'; 

export interface CalculatorData {
    mergejil: MergejilType[];
    tetgeleg: TetgelegType[];
    lessons: LessonType[];
}

/**
 * Тооцоолуурт шаардлагатай бүх өгөгдөл (мэргэжил, тэтгэлэг, хичээл)
 */
export const fetchCalculatorData = async (): Promise<ApiResponse<CalculatorData>> => {
    try {
        console.log("==> 1. Calculator өгөгдөл татаж эхэллээ...");
        
        const [mergejilData, tetgelegData] = await Promise.all([
            getAllMergejil(),
            getTetgeleg(),
        ]);

        console.log("==> 2. Мэргэжил:", mergejilData.length);
        console.log("==> 3. Тэтгэлэг:", tetgelegData.length);

        if (!mergejilData || !tetgelegData) {
            return {
                success: false,
                message: 'Мэргэжил эсвэл тэтгэлгийн өгөгдөл бүрэн татагдаагүй.',
                error: 'Partial data failure',
            };
        }

        if (mergejilData.length === 0) {
            return {
                success: false,
                message: 'Мэргэжлийн өгөгдөл хоосон байна.',
                error: 'Empty mergejil data',
            };
        }

        // 🔥 Мэргэжлүүдээс хичээлүүдийг гаргаж авах
        const lessonsMap = new Map<string, LessonType>();
        
        mergejilData.forEach(mergejil => {
            if (mergejil.hicheeluud && Array.isArray(mergejil.hicheeluud)) {
                mergejil.hicheeluud.forEach(lesson => {
                    // Хичээл давхардахгүй байх
                    if (!lessonsMap.has(lesson.code)) {
                        lessonsMap.set(lesson.code, lesson);
                    }
                });
            }
        });

        const uniqueLessons = Array.from(lessonsMap.values());
        console.log("==> 4. Хичээл (мэргэжлээс):", uniqueLessons.length);

        // 🔥 Хэрэв хичээл хоосон бол default утга
        const defaultLessons: LessonType[] = [
            { code: 'math', name: 'Математик', type: 'main' },
            { code: 'physical', name: 'Физик', type: 'main' },
            { code: 'chemistry', name: 'Хими', type: 'main' },
            { code: 'biology', name: 'Биологи', type: 'main' },
            { code: 'geography', name: 'Газарзүй', type: 'main' },
            { code: 'english', name: 'Англи хэл', type: 'main' },
            { code: 'sociology', name: 'Нийгэм', type: 'main' },
        ];

        const finalLessons = uniqueLessons.length > 0 ? uniqueLessons : defaultLessons;

        return {
            success: true,
            data: {
                mergejil: mergejilData,
                tetgeleg: tetgelegData,
                lessons: finalLessons,
            },
            message: 'Өгөгдөл амжилттай татагдлаа.',
        };

    } catch (error: any) {
        console.error("==> ⛔ fetchCalculatorData алдаа:", error.message);
        return {
            success: false,
            message: 'Өгөгдөл татаж чадсангүй. Сүлжээний холболтыг шалгана уу.',
            error: error.message || 'Unknown error',
        };
    }
};