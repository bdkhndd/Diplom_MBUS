// frontend/app/department/[id].tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { getTenhimById } from '../../services/tenhimService';
import { TenhimType } from '../../services/types'; 
import { API_BASE_URL } from '../../constants/config';

const { width } = Dimensions.get('window');

// tuslh component
const InfoCard = ({ label, content }: { label: string, content: string | undefined | null }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.divider} />
    
    <Text style={styles.content}>
        {content && typeof content === 'string' && content.trim() !== "" ? content.trim() : "Мэдээлэл байхгүй"}
    </Text>
  </View>
);
export default function DepartmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const tenhimId = Array.isArray(id) ? id[0] : id; 

  const [tenhim, setTenhim] = useState<TenhimType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getTenhimById(tenhimId);
        // Backend { data: {...} } эсвэл шууд {...} буцааж байгааг шалгах
        const actualData = res.data ? res.data : res;
        setTenhim(actualData);
      } catch (e) {
        console.error("Тэнхим татахад алдаа:", e);
        setError("Мэдээлэл олдсонгүй");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [tenhimId]);

  const getFirstImage = () => {
  if (!tenhim?.zurag) return null;

  let imagePath = "";

  if (Array.isArray(tenhim.zurag)) {
    // Хэрэв массив бол эхнийхийг авна
    imagePath = tenhim.zurag[1];
  } else if (typeof tenhim.zurag === 'string') {
    // Хэрэв таслалаар салсан текст ирвэл салгаад эхнийхийг авна
    imagePath = tenhim.zurag.split(',')[1];
  }

  if (!imagePath) return null;

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `http://10.150.34.26:4000${cleanPath}`;
};

const imageUri = getFirstImage();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header хэсэг */}
      <View style={styles.customHeader}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.customHeaderTitle} numberOfLines={1}>
            {tenhim?.ner || 'Тэнхим'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          {imageUri ? (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.mainImage} 
              onError={(e) => console.log("Зургийн алдаа:", e.nativeEvent.error)}
            />
          ) : (
            <View style={[styles.mainImage, styles.placeholderImage]}>
               <Ionicons name="image-outline" size={50} color="#999" />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.mainTitle}>{tenhim?.ner?.trim() || 'Тэнхим'}</Text>
          <InfoCard label="Тэргүүлэх чиглэл" content={tenhim?.tergvvleh_chiglel} />
          <InfoCard label="Багшлах бүрэлдэхүүн" content={tenhim?.tailbar} />
          <InfoCard label="Бүтээл" content={tenhim?.bvteel} />
          <InfoCard label="Шагнал" content={tenhim?.shagnal} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa' 
  },
  loading: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f5f7fa'
  },
  customHeader: {
    height: 90, 
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: -5,
  },
  customHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    width: '70%', 
  },
  imageWrapper: {
    width: '90%',
    height: 220,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#ddd',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  placeholderImage: { 
    backgroundColor: '#ccc' 
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3b5998',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3b5998',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});