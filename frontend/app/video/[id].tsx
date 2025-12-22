import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ActivityIndicator, ScrollView, 
  Dimensions, StatusBar, Platform, TouchableOpacity, SafeAreaView 
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { getVideoById } from '../../services/videoService';
import { VideoType } from '../../services/types';

const BASE_URL = 'http://10.150.34.26:4000';
const PRIMARY_COLOR = '#3b5998';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [video, setVideo] = useState<VideoType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      if (!id) return;
      const data = await getVideoById(id);
      if (data) setVideo(data);
      setLoading(false);
    }
    init();
  }, [id]);

  const videoSource = video?.videoUrl.startsWith('http') 
    ? video.videoUrl 
    : `${BASE_URL}/${video?.videoUrl.replace(/^\/+/, '')}`;

  const player = useVideoPlayer(videoSource, (p) => {
    p.play();
  });

  // Огноо форматлах
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('mn-MN');
  };

  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={PRIMARY_COLOR} /></View>;
  if (!video) return <View style={s.center}><Text>Видео олдсонгүй.</Text></View>;

  return (
    <View style={s.screenContainer}>
      {/* 1. Custom Header (Payment-тэй ижил) */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={s.customHeader}>
          <View style={s.headerInner}>
              <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
                  <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={s.headerTitle}>Видео хичээл</Text>
          </View>
      </View>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 2. Видео тоглуулагч */}
          <View style={s.videoWrapper}>
            <VideoView
              style={s.fullVideo}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>

          {/* 3. Дэлгэрэнгүй мэдээлэл */}
          <View style={s.detailsContainer}>
            <Text style={s.fullTitle}>{video.title}</Text>
            
            <View style={s.statsRow}>
              <Text style={s.dateText}>Нийтлэгдсэн: {formatDate(video.createdAt)}</Text> 
            </View>

            <View style={s.line} />

            <View style={s.descriptionSection}>
              <View style={s.sectionHeader}>
                <Ionicons name="information-circle-outline" size={20} color="#333" />
                <Text style={s.sectionTitle}>Тайлбар</Text>
              </View>
              <Text style={s.fullDesc}>
                {video.description || 'Энэхүү видеоны тайлбар одоогоор байхгүй байна.'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Custom Header Styles (Payment-тэй яг ижил)
  customHeader: {
    height: 120, 
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    paddingBottom: 15,
    paddingTop: Platform.OS === 'ios' ? 45 : 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  videoWrapper: { backgroundColor: '#000' },
  fullVideo: { 
    width: '100%', 
    height: Dimensions.get('window').width * (9/16), 
  },
  detailsContainer: { 
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -6, // Видеон дээр бага зэрэг давхарлаж харагдуулна
  },
  fullTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#1a1a1a',
    lineHeight: 28
  },
  statsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500'
  },
  line: { 
    height: 1, 
    backgroundColor: '#f0f0f0', 
    marginVertical: 20 
  },
  descriptionSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
  },
  fullDesc: { 
    fontSize: 15, 
    color: '#555', 
    lineHeight: 24 
  }
});