// styles/welcome.js

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// 💡 ТЕМ болон ХУВЬСАГЧИД (WelcomeScreen.tsx-ээс авчирсан)
export const COLORS = {
    primary: '#3b5998', 
    secondary: '#4A90E2', 
    background: '#fff', 
    appBackground: '#F5F0F0', 
    textTitle: '#333',
    textBody: '#666',
};

export const LAYOUT = {
    borderRadius: 30,
    spacing: 20,
    buttonSize: 70,
};

// ----------------------------------------------------
// Styles
// ----------------------------------------------------
export const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.appBackground, 
    },
    topHeaderBackground: {
        height: 130, 
        backgroundColor: COLORS.primary, 
    },
    whiteContentContainer: {
        flex: 1,
        backgroundColor: COLORS.background, 
        borderTopLeftRadius: LAYOUT.borderRadius,
        borderTopRightRadius: LAYOUT.borderRadius,
        marginTop: -LAYOUT.spacing, 
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between', 
        paddingTop: 50, 
        paddingHorizontal: LAYOUT.spacing,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50, 
    },
    logo: {
        width: width * 0.45, 
        height: width * 0.45,
        marginBottom: LAYOUT.spacing, 
    },
    schoolTitleLine1: {
        fontSize: 18,
        fontWeight: '700', 
        color: COLORS.textTitle,
        textAlign: 'center',
    },
    schoolTitleLine2: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textTitle,
        textAlign: 'center',
        marginTop: 5,
    },
    bottomContainer: {
        justifyContent: 'flex-start', 
        alignItems: 'center',
        paddingBottom: 80, 
    },
    welcomeText: {
        fontSize: 22, 
        color: COLORS.textBody,
        marginBottom: 40,
        fontWeight: '400', 
    },
    button: {
        backgroundColor: COLORS.secondary, 
        width: LAYOUT.buttonSize,
        height: LAYOUT.buttonSize,
        borderRadius: LAYOUT.buttonSize / 2, 
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
});