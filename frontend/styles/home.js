// styles/home.js

import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

// ----------------------------------------------------
// I. БРЭНД БОЛОН ТУСЛАХ УТГУУД (EXPORTED CONSTANTS)
// ----------------------------------------------------
export const CARD_WIDTH = width * 0.45;
export const PRIMARY_COLOR = '#3b5998'; // Үндсэн цэнхэр
export const APP_BACKGROUND = '#f9f9f9'; // Үндсэн фон
export const BORDER_RADIUS = 0; // Дугуй ирмэгийг тэг болгосон
export const CURVE_OVERLAP = 0; // Давхарлалтыг арилгасан #3b5998

// 💡 Шинээр нэмсэн: Менюний өнгө (#2b6b73)
export const LIGHT_TEAL = '#E4F0FF'; 

// Header-ийн контент болон ScrollView-ийн зайг тооцоолох
export const CUSTOM_HEADER_HEIGHT = 150; 
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
export const SCROLL_PADDING_TOP = CUSTOM_HEADER_HEIGHT + 10; 


// ----------------------------------------------------
// II. СТИЛИЙН ХЭСЭГ (Styles with 'export const')
// ----------------------------------------------------

// Хэдерийн стиль
export const headerStyles = StyleSheet.create({ 
    customHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: CUSTOM_HEADER_HEIGHT, 
        backgroundColor: PRIMARY_COLOR,
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0,
        
        paddingTop: STATUS_BAR_HEIGHT, 
        paddingHorizontal: 15,
        justifyContent: 'center', // Голлосон
        zIndex: 20, 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        borderBottomColor: PRIMARY_COLOR, 
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center', // Голлосон
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 0, 
        height: 60,
    },
    logo: {
        width: 40, 
        height: 40,
        marginRight: 10,
        tintColor: '#eee', 
    },
    searchContainer: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20, 
        paddingHorizontal: 10,
        height: 38, 
        marginHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        paddingLeft: 8, 
        fontSize: 14,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        color: 'white', 
    }
});

// Картын стиль 
export const cardStyles = StyleSheet.create({ 
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH + 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 15,
        marginBottom: 5,
        alignItems: 'center',
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: CARD_WIDTH, 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        resizeMode: 'cover', 
        backgroundColor: '#eee',
    },
    name: {
        fontWeight: '600',
        fontSize: 20,
        color: PRIMARY_COLOR,
        padding: 8,
        textAlign: 'center',
    },
});


// 💡 Шинээр нэмсэн: Үндсэн менюний стилүүд
export const menuStyles = StyleSheet.create({
    menuContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        // 💡 Цэнхэр тунгалаг фон (Transparency)
        backgroundColor: '#4182d0ff', // 85% тунгалаг цэнхэр
        marginBottom: 12,
        
        // Сүүдэр нэмж гүн харагдуулах
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
    },
    menuText: {
        fontSize: 20,
        color: '#ffffffff', // 💡 Цагаан текст
        fontWeight: '600', // 💡 Bold (Тод)
        marginLeft: 15,
    },
    menuIcon: {
        color: '#FFFFFF', // 💡 Цагаан икон
        
    },
    lastItem: {
        marginBottom: 0,
    }
});


// Ерөнхий стиль
export const styles = StyleSheet.create({ 
    mainWrapper: {
        flex: 1,
        backgroundColor: APP_BACKGROUND,
    },
    fullScreenCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: APP_BACKGROUND,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingTop: CUSTOM_HEADER_HEIGHT, 
        paddingBottom: 20,
    },
    contentShadowWrapper: {
        marginTop: CURVE_OVERLAP, 
        borderTopLeftRadius: BORDER_RADIUS, 
        borderTopRightRadius: BORDER_RADIUS, 
        backgroundColor: '#fff',
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
        overflow: 'hidden', 
        zIndex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 0, 
    },
    sectionHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        marginTop: 15,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    horizontalList: {
        paddingHorizontal: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    errorTextDetail: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
    hintText: {
        color: PRIMARY_COLOR,
        fontSize: 12,
        marginTop: 15,
    },
    noDataText: {
        paddingHorizontal: 15,
        color: '#999',
    }
});