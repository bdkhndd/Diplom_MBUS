import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllTulbur } from '../../services/tulburService';
import { TulburType } from '../../services/types';


const PRIMARY_COLOR = '#3b5998'; 

export default function PaymentScreen() {
  const [tulburData, setTulburData] = useState<TulburType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllTulbur();
    if (data && data.length > 0) {
      setTulburData(data[0]); 
    }
    setLoading(false);
  };

  const renderMajorChips = (majors: any[]) => (
    <View style={styles.chipContainer}>
      {majors.map((m) => (
        <View key={m._id} style={styles.chip}>
          <Text style={styles.chipText}>{m.mergejil_Ner}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {/* Header  */}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.customHeader}>
          <View style={styles.headerInner}>
              <TouchableOpacity 
                  onPress={() => router.back()} 
                  style={styles.backButton}
              >
                  <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Сургалтын төлбөр</Text>
          </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        
          {tulburData ? (
            <>
              {/* 1. Тэргүүлэх чиглэл */}
              <View style={styles.mainCard}>
          <View style={[styles.statusBadge, { backgroundColor: '#E3F2FD' }]}>
            <Text style={[styles.statusText, { color: '#1976D2' }]}>Эрэлттэй мэргэжилүүд</Text>
          </View>
          
          <View style={styles.priceSection}>
            <Ionicons name="school" size={32} color="#3b5998" />
            <View>
              {/* <Text style={styles.cardTitle}>Тэргүүлэх чиглэл</Text> */}
              <Text style={styles.priceValue}>
                {Number(tulburData.terguuleh_erelttei.tulbur).toLocaleString()} {tulburData.terguuleh_erelttei.negj_temdeg}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.sectionLabel}>Багтах мэргэжлүүд:</Text>
          {renderMajorChips(tulburData.terguuleh_erelttei.meregjilId)}
        </View>



        {/* busad */}

        <View style={styles.mainCard}>
          <View style={[styles.statusBadge, { backgroundColor: '#F5F5F5' }]}>
            <Text style={[styles.statusText, { color: '#666' }]}>Бусад мэргэжил</Text>
          </View>

          <View style={styles.priceSection}>
            <Ionicons name="school" size={32} color="#3b5998" />
            <View>
              {/* <Text style={styles.cardTitle}>Бусад мэргэжил</Text> */}
              <Text style={styles.priceValue}>
                {Number(tulburData.busad_mergejil.tulbur).toLocaleString()} {tulburData.busad_mergejil.negj_temdeg}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Багтах мэргэжлүүд:</Text>
          {renderMajorChips(tulburData.busad_mergejil.meregjilId)}
        </View>



        {/* zadargaa */}

        <View style={styles.infoBox}>
          <View style={styles.infoBoxHeader}>
            <MaterialCommunityIcons name="calculator-variant" size={24} color="#333" />
            <Text style={styles.infoTitle}>Кредитийн үнэлгээ</Text>
          </View>
          
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <View style={[styles.dot, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.label}>Заавал судлах</Text>
            </View>
            <Text style={styles.value}>{Number(tulburData.tulburiin_zadargaa.zaawlSudlah_kredit).toLocaleString()} ₮</Text>
          </View>
          
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={styles.labelGroup}>
              <View style={[styles.dot, { backgroundColor: '#9C27B0' }]} />
              <Text style={styles.label}>Сонгон судлах</Text>
            </View>
            <Text style={styles.value}>{Number(tulburData.tulburiin_zadargaa.songonSudlah_kredit).toLocaleString()} ₮</Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.noteText}>
            Төлбөр нь тухайн хичээлийн жилийн магадлан итгэмжлэлийн дагуу өөрчлөгдөх боломжтой.
          </Text>
        </View>
            </>
          ) : (
            <Text style={styles.center}>Мэдээлэл олдсонгүй</Text>
          )}
        </ScrollView>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Тэтгэлэг дэлгэцтэй яг ижил Header загвар
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
  backText: { color: '#fff', fontSize: 16, marginLeft: -4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  listContainer: { padding: 16, paddingBottom: 40 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },

//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 16,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },

  cardTitle: { fontSize: 20, fontWeight: '500', color: '#333' },
  cardBody: { padding: 20, alignItems: 'center' },
  priceText: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  subLabel: { color: '#666', marginTop: 4, fontSize: 14 },

 mainCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 15,
  },
  statusText: { fontSize: 15, fontWeight: '800' },
  priceSection: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  priceValue: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginTop: 2 },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#888', marginBottom: 10 },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { 
    backgroundColor: '#F0F2F5', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E4E8'
  },
  chipText: { fontSize: 12, color: '#444', fontWeight: '500' },

  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  infoBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  infoTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 15, color: '#555', fontWeight: '500' },
  value: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },

  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#E8EAED',
    padding: 15,
    borderRadius: 15,
    gap: 10,
    alignItems: 'center',
  },
  noteText: { flex: 1, color: '#666', fontSize: 12, lineHeight: 18 },
  
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: '#fff', fontWeight: '600' }
});