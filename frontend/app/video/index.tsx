import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, StatusBar, RefreshControl, Dimensions, Platform, SafeAreaView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';

import { getAllVideos } from '../../services/videoService';
import { VideoType } from '../../services/types';

const BASE_URL = 'http://10.150.34.26:4000'; 
const PRIMARY_COLOR = '#3b5998';
const { width } = Dimensions.get('window');

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('mn-MN', { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- VideoCard Component ---
const VideoCard = memo(({ item, onPress }: { item: VideoType; onPress: () => void }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function generateThumbnail() {
      try {
        const cleanPath = item.videoUrl.replace(/^\/+/, '');
        const videoUri = item.videoUrl.startsWith('http') ? item.videoUrl : `${BASE_URL}/${cleanPath}`;
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 1000, quality: 0.3 });
        if (isMounted) setThumbnail(uri);
      } catch (e) { console.log("Thumbnail failed:", item.title); } 
      finally { if (isMounted) setLoading(false); }
    }
    generateThumbnail();
    return () => { isMounted = false; };
  }, [item.videoUrl]);

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.95}>
      <View style={s.thumbnailWrapper}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={s.thumbnail} contentFit="cover" transition={200} cachePolicy="memory-disk" />
        ) : (
          <View style={s.loadingThumb}><ActivityIndicator size="small" color={PRIMARY_COLOR} /></View>
        )}
        <View style={s.playOverlay}>
           <View style={s.playIconBg}><Ionicons name="play" size={24} color="#fff" /></View>
        </View>
        <View style={s.timeBadge}><Text style={s.timeText}>ВИДЕО</Text></View>
      </View>
      <View style={s.infoSection}>
        <View style={s.avatarContainer}>
          <View style={s.avatar}><Ionicons name="school" size={18} color="#fff" /></View>
        </View>
        <View style={s.textSection}>
          <Text style={s.title} numberOfLines={2}>{item.title}</Text>
          <View style={s.metaRow}>
            <Text style={s.metaText}>{formatDate(item.createdAt)}</Text>
            <Text style={s.dot}> • </Text>
            <Text style={s.metaText}>зөвлөмж</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// --- Main Screen ---
export default function VideoScreen() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await getAllVideos();
      setVideos(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <View style={s.screenContainer}>
      {/* PaymentScreen-тэй ижилхэн Header тохиргоо */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={s.customHeader}>
          <View style={s.headerInner}>
              <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
                  <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={s.headerTitle}>Видео зөвлөмж</Text>
          </View>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {loading && !refreshing ? (
          <View style={s.center}><ActivityIndicator size="large" color={PRIMARY_COLOR} /></View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item._id || Math.random().toString()}
            contentContainerStyle={{ padding: 16 }}
            initialNumToRender={5}
            windowSize={5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={PRIMARY_COLOR} />
            }
            renderItem={({ item }) => <VideoCard item={item} onPress={() => router.push(`/video/${item._id}`)} />}
            ListEmptyComponent={<View style={s.center}><Text style={{ color: '#999' }}>Одоогоор видео байхгүй байна.</Text></View>}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Custom Header (Payment-тэй яг ижил)
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

  // Video Card Styles
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15 },
  thumbnailWrapper: { width: '100%', height: width * 0.52, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  thumbnail: { width: '100%', height: '100%' },
  loadingThumb: { position: 'absolute' },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)' },
  playIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(59, 89, 152, 0.9)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  timeBadge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  timeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  infoSection: { padding: 16, flexDirection: 'row' },
  avatarContainer: { marginRight: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' },
  textSection: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', lineHeight: 22, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: '#888' },
  dot: { color: '#F0F0F0', marginHorizontal: 4 }
});