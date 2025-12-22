import React, { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router'; 
import { 
    View, 
    Text, 
    ScrollView, 
    ActivityIndicator, 
    FlatList, 
    Dimensions,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    Alert 
} from 'react-native';

import { Ionicons } from '@expo/vector-icons'; 
import { getTenhim } from '../../services/tenhimService'; 
import { TenhimType } from '../../services/types'; 

import { 
    headerStyles, 
    cardStyles, 
    styles, 
    PRIMARY_COLOR, 
    CUSTOM_HEADER_HEIGHT,
    menuStyles, 
    LIGHT_TEAL 
} from '../../styles/home'; 
import Animated, { 
    FadeInDown, 
    Easing, 
    FadeOut 
} from 'react-native-reanimated';

const SMALL_LOGO = require('../../assets/images/logo_small.png'); 

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45; 

const CHEMISTRY_IMG = require('../../assets/images/tenhim/chemistry.png'); 
const BIOLOGY_IMG = require('../../assets/images/tenhim/biology.jpg'); 
const MATH_IMG = require('../../assets/images/tenhim/math.jpg'); 
const INFORMATICS_IMG = require('../../assets/images/tenhim/informatics.jpg');
const DIDACTIC_IMG = require('../../assets/images/tenhim/didactic.jpg'); 
const PHYSICS_IMG = require('../../assets/images/tenhim/physics.png'); 
const GEOGRAPHY_IMG = require('../../assets/images/tenhim/geography.png'); 

const router = useRouter() as any;

// zurgiig nerr oloh func
const getTenhimImage = (name: string): any => { 
    const lowerName = name.toLowerCase();
    if (lowerName.includes('биологи')) return BIOLOGY_IMG; 
    if (lowerName.includes('математик')) return MATH_IMG; 
    if (lowerName.includes('мэдээлэл')) return INFORMATICS_IMG; 
    if (lowerName.includes('дидактик')) return DIDACTIC_IMG; 
    if (lowerName.includes('хими')) return CHEMISTRY_IMG; 
    if (lowerName.includes('физик')) return PHYSICS_IMG; 
    if (lowerName.includes('газарзүй')) return GEOGRAPHY_IMG; 
    return CHEMISTRY_IMG;
};
const BASE_URL = 'http://10.150.34.26:4000'; 

interface TenhimCardProps { item: TenhimType; }
const TenhimCard: React.FC<TenhimCardProps> = ({ item }) => {
    const router = useRouter(); 
    
    // 1. Backend-ээс ирсэн зургийн замыг бэлдэх
    // item.zurag нь массив тул 0-р индексийг шалгана
    const backendImage = item.zurag && item.zurag.length > 0 
        ? { uri: `${BASE_URL}${item.zurag[0]}` } 
        : null;

    // 2. Хэрэв Backend-ээс зураг байхгүй бол нэрээр нь статик зураг сонгох (Fallback)
    const fallbackImage = getTenhimImage(item.ner); 

    const handlePress = () => {
        router.push({ pathname: "/department/[id]", params: { id: item._id } } as any); 
    };

    return (
        <TouchableOpacity onPress={handlePress} style={cardStyles.card}>
            <Image 
                // Backend-ийн зураг байвал түүнийг, байхгүй бол статик зургийг харуулна
                source={backendImage ? backendImage : fallbackImage} 
                style={cardStyles.image} 
                resizeMode="cover"
            /> 
            <Text style={cardStyles.name} numberOfLines={2}>{item.ner}</Text>
        </TouchableOpacity>
    );
};

// menu 
const homeMenuItems = [
    { id: '1', title: 'Мэргэжил', icon: 'school-outline' },
    { id: '2', title: 'Тэтгэлэг', icon: 'trophy-outline' }, 
    { id: '3', title: 'Хамтарсан хөтөлбөр', icon: 'people-outline' },
    { id: '4', title: 'Сургалтын төлбөр', icon: 'wallet-outline' },
    { id: '5', title: 'Видео зөвлөмж', icon: 'videocam-outline' },
];

const MenuItem = ({ item, index, isLast }: { item: typeof homeMenuItems[0], index: number, isLast: boolean }) => {
    const router = useRouter(); 

    const handlePress = () => {
        if (item.title === 'Мэргэжил') {
            router.push('/programs'); 
        } else if (item.title === 'Тэтгэлэг') {
           
            router.push('/scholarship'); 
        } else if (item.title === 'Хамтарсан хөтөлбөр') {
            
            router.push('/collaborative'); 
        
        }else if (item.title === 'Сургалтын төлбөр') {
            
            router.push('/payment'); 
        }else if (item.title === 'Видео зөвлөмж') {
            
            router.push('/video'); 
        }
        else {
            console.log(`Навигацийн логик "${item.title}" хэсэгт нэмэгдэнэ.`);
        }
    };

    

    return (
        <Animated.View
            entering={
                FadeInDown.duration(400)
                .delay(index * 100)
                .easing(Easing.out(Easing.ease))
            }
        >
            <TouchableOpacity 
                style={[menuStyles.menuItem, isLast && menuStyles.lastItem]} 
                activeOpacity={0.8}
                onPress={handlePress} 
            >
                <Ionicons name={item.icon as any} size={30} style={menuStyles.menuIcon} />
                <Text style={menuStyles.menuText}>{item.title}</Text>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-forward-outline" size={24} style={menuStyles.menuIcon} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function HomeScreen() {
    const [departments, setDepartments] = useState<TenhimType[]>([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const tenhims = await getTenhim(); 
            setDepartments(tenhims); 
        } catch (e) {
            console.error("Мэдээлэл татахад алдаа гарлаа:", e);
            setDepartments([]); 
            setError(e instanceof Error ? e.message : "Үл мэдэгдэх сүлжээний алдаа. Сервер талыг шалгана уу.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []); 

    // loading boln error
    if (isLoading) {
        return (
            <View style={styles.fullScreenCenter}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.fullScreenCenter}>
                <Text style={styles.errorText}>Мэдээлэл татахад алдаа гарлаа:</Text>
                <Text style={styles.errorTextDetail}>{error}</Text>
                <Text style={styles.hintText}>Сервер ажиллаж байгаа эсэх болон API-ийн замыг шалгана уу.</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainWrapper}> 
            <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} translucent={true} /> 

            <ScrollView 
                style={styles.container} 
                contentContainerStyle={[styles.scrollContent, { paddingTop: CUSTOM_HEADER_HEIGHT }]} 
            >
                <View style={styles.contentShadowWrapper}> 
                    <View style={styles.contentContainer}> 
                        
                        <Text style={styles.sectionHeader}>Тэнхимүүд</Text>
                        
                        {/* tenhimvvdn jagsaalt */}
                        <FlatList
                            data={departments}
                            keyExtractor={(item) => item._id!}
                            renderItem={({ item }) => <TenhimCard item={item} />}
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                            ListEmptyComponent={() => <Text style={styles.noDataText}>Мэдээлэл олдсонгүй.</Text>}
                        />
                        
                        {/* menu */}
                       <View style={menuStyles.menuContainer}>
    {homeMenuItems.map((item, index) => (
        <MenuItem 
            key={item.id} 
            item={item} 
            index={index} 
            isLast={index === homeMenuItems.length - 1} 
        />
    ))}
</View>
                        
                        {/* dood taln zai */}
                        <View style={{ height: 200 }} /> 
                    </View>
                </View>
            </ScrollView>

            {/* header */}
            <View style={headerStyles.customHeader}>
                <View style={headerStyles.headerRow}>
                    <Image source={SMALL_LOGO} style={headerStyles.logo} resizeMode="contain" />
                    
                    
                    <View style={headerStyles.searchContainer}>
                        <Ionicons name="search" size={20} color="#999" />
                        <TextInput placeholder="Хайх" placeholderTextColor="#999" style={headerStyles.searchInput} />
                    </View>
                    
                    <TouchableOpacity 
                        style={headerStyles.notificationIcon}
                        onPress={
                            () => 
                             router.push('/feedback' as any)} // Санал хүсэлтийн хуудас руу үсрэх
        >
            <Ionicons name="chatbubble-ellipses-outline" size={26} color="#fff" />
        </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}