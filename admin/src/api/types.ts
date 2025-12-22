// ===================================
// API RESPONSE TYPE
// ===================================
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

// ===================================
// 1. TENHIM (Тэнхим) - DEPARTMENT
// ===================================
export type TenhimType = {
    _id?: string;
    ner: string;
    tergvvleh_chiglel: string;
    shagnal?: string;
    zurag?: string[];                      // 🔥 Зураг массив: [cover.webp, detail.webp]
    bvteel?: string;
    tailbar?: string;
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// 2. MERGEJIL (Мэргэжил) - MAJOR/SPECIALTY
// ===================================
export type Hicheel = {
    code: string;
    name: string;
    type: 'main' | 'secondary';
};

export type MergejilType = {
    _id?: string;
    tenhimId: string | TenhimType;
    mergejil_Kod: string;
    mergejil_Ner: string;
    tailbar?: string;
    sudlah_kredit: number;
    suraltsah_hugatsaa: string;
    minScore: number;
    hicheeluud: Hicheel[];
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// 3. HAMTARSAN HUT (Хамтарсан Хөтөлбөр) - PARTNERSHIP
// ===================================
export type HamtarsanHutType = {
    _id?: string;
    mergejilId: string | MergejilType;
    uls: string;
    surguuli: string;
    hutulbur: string;
    hugatsaa: string;
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// 4. TETGELEG (Тэтгэлэг) - SCHOLARSHIP
// ===================================
export type TetgelegType = {
    _id?: string;
    meregjilId: string[] | string | MergejilType[] | MergejilType;
    teteglegNer: string;
    shaardlag: string;
    bosgo_Onoo: number;
    teteglegiin_Hemjee: String;
    hugatsaa: string;
    createdAt?: string;
    updatedAt?: string;
};

export type TulburType = {
    _id?: string;
    terguuleh_erelttei: {
        tulbur: number;
        negj_temdeg: string;
        meregjilId: string[] | MergejilType[];
    };
    busad_mergejil: {
        tulbur: number;
        negj_temdeg: string;
        meregjilId: string[] | MergejilType[];
    };
    tulburiin_zadargaa: {
        zaawlSudlah_kredit: number;
        songonSudlah_kredit: number;
        currency: string;
    };
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// 6. VIDEO (Видео) - MEDIA CONTENT
// ===================================
export type VideoType = {
    _id?: string;
    title: string;
    description: string;
    videoUrl: string;                     // YouTube эсвэл Vimeo URL
    thumbnail?: string;                   // Thumbnail зураг URL
    duration?: number;                    // Сек-ээр                   
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// 7. CONTACT INFO (Холбоо Барих Мэдээлэл)
// ===================================
export type ContactInfoType = {
    _id?: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    workingHours: {
        weekdays: string;
        weekend: string;
    };
    departments: Array<{
        name: string;
        phone: string;
        email?: string;
    }>;
    emergencyContacts?: Array<{
        name: string;
        phone: string;
    }>;
    location: {
        latitude: number;
        longitude: number;
    };
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// 8. FEEDBACK (Санал Хүсэлт)
// ===================================
export type FeedbackType = {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status?: 'new' | 'read' | 'replied' | 'archived';
    priority?: 'low' | 'medium' | 'high';
    adminNote?: string;
    attachments?: string[];                // URL массив
    createdAt?: string;
    updatedAt?: string;
};

// ===================================
// HELPER TYPES
// ===================================
export interface MergejilTypeSimple {
    _id: string;
    mergejil_Ner: string;
    mergejil_Kod?: string;
}

export type TetgelegCategory = 'ToriinSan' | 'Surguuli';
export type UITetgelegType = TetgelegType & { category?: TetgelegCategory };