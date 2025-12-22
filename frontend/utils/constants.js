// utils/constants.js

import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Брэнд болон Хэмжээс
export const PRIMARY_COLOR = '#3b5998'; 
export const APP_BACKGROUND = '#F5F0F0'; 
export const BORDER_RADIUS = 30; 
export const CURVE_OVERLAP = 25; 
export const TABS_BAR_HEIGHT = 70; 

// Header-ийн нийт өндөр
export const TOTAL_HEADER_HEIGHT = Constants.statusBarHeight + 70; 

// Card хэмжээс
export const CARD_WIDTH = width * 0.4;