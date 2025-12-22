// WelcomeScreen

import React, { useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    Animated,
    StatusBar,
    // StyleSheet, Dimensions, Platform-ийг
} from 'react-native';
import { router, Stack } from 'expo-router'; 
import { Feather } from '@expo/vector-icons'; 

import { styles, COLORS, LAYOUT } from '../styles/welcome'; 


const SCHOOL_LOGO = require('../assets/images/logo.png'); 

const WelcomeScreen: React.FC = () => {
    
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(0.5)).current; 

    useEffect(() => {
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        Animated.timing(textOpacity, { toValue: 1, duration: 800, delay: 400, useNativeDriver: true }).start();
        Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }, []);

    const handlePress = () => {
        router.replace('/(tabs)'); 
    };

    return (
        <View style={styles.fullScreenContainer}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} /> 

            <Stack.Screen options={{ headerShown: false }} /> 

            <View style={styles.topHeaderBackground} />

            <View style={styles.whiteContentContainer}>
                <View style={styles.container}>
          
                    <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
                        <Image 
                            source={SCHOOL_LOGO} 
                            style={styles.logo}
                            resizeMode="contain" 
                        />
                        <Text style={styles.schoolTitleLine1}>МАТЕМАТИК БАЙГАЛИЙН</Text>
                        <Text style={styles.schoolTitleLine2}>УХААНЫ СУРГУУЛЬ</Text>
                    </Animated.View>

                    {/* Welcome Мэдэгдэл ба Товч */}
                    <View style={styles.bottomContainer}>
                        {/* Welcome Text (Fade-in) */}
                        <Animated.View style={{ opacity: textOpacity }}>
                            <Text style={styles.welcomeText}>Тавтай морил</Text>
                        </Animated.View>

                        {/* Товчлуур (Scale up) */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={handlePress}
                                activeOpacity={0.7}
                            >
                                <Feather name="arrow-right" size={30} color="white" /> 
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WelcomeScreen;