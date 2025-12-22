// frontend/constants/Colors.ts

// Энэ бол theme-ээс хамаарахгүй үндсэн өнгөнүүд (Global Colors)
const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
    // Theme-ээс үл хамаарах, UI-ийн үндсэн өнгөнүүд
    primary: '#0D47A1', // Цэнхэр
    accent: '#1976D2',
    white: '#FFFFFF',
    text: '#212121',
    lightGray: '#F5F5F5',
    success: '#388E3C', 
    error: '#E65100',   
    
    // Theme-ээс хамаарах өнгөнүүд (useThemeColor-т зориулсан)
    light: {
        text: '#111827',
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#fff',
        background: '#000',
        tint: tintColorDark,
        icon: '#9BA1A6',
        tabIconDefault: '#9BA1A6',
        tabIconSelected: tintColorDark,
    },
};