export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface DepartmentItem {
    _id: string;
    ner: string; 
    createdAt?: string;
    updatedAt?: string;
}


export interface TenhimType {
    _id?: string;
  ner: string; 
  tergvvleh_chiglel: string; 
  shagnal: string; 
  zurag?: string | string[]; 
  bvteel?: string; 
  tailbar?: string
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonType {
    code: string;
    name: string;
    type: 'main' | 'secondary'; 
}

export interface MergejilType {
    _id: string;
    tenhimId: TenhimType | string; 
    mergejil_Kod: string;
    mergejil_Ner: string;
    tailbar: string;
    sudlah_kredit: string;
    suraltsah_hugatsaa: string;
    minScore: number;
    hicheeluud: LessonType[];
    createdAt?: string;
    updatedAt?: string;
}

export interface MergejilTypeSimple {
    _id: string;
    mergejil_Ner: string;
}

export interface TetgelegType {
    _id: string;
    meregjilId: MergejilTypeSimple[] | string[]; 
    teteglegNer: string;
    shaardlag: string;
    bosgo_Onoo: number; 
    teteglegiin_Hemjee: string; 
    hugatsaa: string;
    category: string;
}

export type TetgelegCategory = 'ToriinSan' | 'Surguuli';

export type UITetgelegType = TetgelegType & { category: TetgelegCategory };

export interface hamtarsan_hut {
    _id: string;
    mergejilId: string;
    uls: string;
    surguuli: string;
    hutulbur: string,
    hugatsaa: string;
}

export interface DadlagaType {
    _id: string;
    mergejilId: string;
    dadlaga_Ner: string;
    hugatsaa: string; 
}

export type ShagnalType = {
    _id?: string;
    tenhimId: string; 
    shagnal_Ner: string;
    shagnal_Turul: string;
    ognoo: string; 
    createdAt?: string;
    updatedAt?: string;
}

export interface ProgramDetailResponse {
    mergejil: MergejilType;
    tenhim: TenhimType;
    tetegleg: TetgelegType[]; 
    hamtarsan_hut: hamtarsan_hut[];
    dadlaga: DadlagaType[];
    shagnal: ShagnalType[]; 
}


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

export interface TulburType {
    _id: string; 
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
}

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
