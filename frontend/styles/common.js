// styles/common.js

import { StyleSheet } from 'react-native';
import Constants from 'expo-constants'; 

// Тогтмолууд
export const HEADER_HEIGHT = 120; 
export const OVERLAP_HEIGHT = 20; 
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;

export const commonStyles = StyleSheet.create({
    contentShadowWrapper: {
        flex: 1, 
        // Цагаан хэсгийг цэнхэр хэсэг дээр давхарлах
        marginTop: -OVERLAP_HEIGHT,
        
        // Дугуй ирмэг
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,
        
        backgroundColor: '#fff', 
        
        // Сүүдэр
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 8,
        elevation: 8,
        
        zIndex: 1, // Лого (10) ба Header (999)-ээс доогуур
    },

    contentContainer: {
        flex: 1,
        backgroundColor: '#fff', 
        paddingTop: OVERLAP_HEIGHT, 
    },
});