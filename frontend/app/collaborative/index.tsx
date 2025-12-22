import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  StatusBar,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

import { getAllCollab } from '../../services/hamtarsan_hutService';
import { getAllMergejil } from '../../services/mergejilService';
import { hamtarsan_hut, MergejilType } from '../../services/types';

const PRIMARY_COLOR = '#3b5998';

type CollabType = Omit<hamtarsan_hut, 'mergejilId'> & {
  mergejilId: string | MergejilType; 
};

type ProgramWithProgress = MergejilType & {
  progress: number;
  totalPrograms: number;
};

export default function CollaborativeProgramsScreen() {
  const router = useRouter(); // Router todorhoilh
  const [collaborativePrograms, setCollaborativePrograms] = useState<CollabType[]>([]);
  const [programs, setPrograms] = useState<ProgramWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithProgress | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getCollabMergejilId = (collab: CollabType): string => {
    if (typeof collab.mergejilId === 'object' && collab.mergejilId !== null && '_id' in collab.mergejilId) {
      return String(collab.mergejilId._id).trim();
    }
    return String(collab.mergejilId).trim();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const mergejils = await getAllMergejil();
      const collabs = (await getAllCollab()) as CollabType[];

      setCollaborativePrograms(collabs);

      const programsWithProgress = mergejils.map(program => {
        const programId = String(program._id).trim();
        const relatedCollabs = collabs.filter(c => getCollabMergejilId(c) === programId);
        return {
          ...program,
          progress: relatedCollabs.length,
          totalPrograms: relatedCollabs.length
        };
      });

      setPrograms(programsWithProgress);
      setError(null);
    } catch (err) {
      setError('Мэдээлэл татахад алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openProgramDetail = (program: ProgramWithProgress) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  const getRelatedCollabs = (programId: string) => {
    const idToMatch = String(programId).trim();
    return collaborativePrograms.filter(c => getCollabMergejilId(c) === idToMatch);
  };

  return (
    <View style={s.container}>
      {/* header nuuh */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      <View style={s.customHeader}>
          <View style={s.headerInner}>
              <TouchableOpacity 
                  onPress={() => router.back()} 
                  style={s.backButton}
                  activeOpacity={0.7}
              >
                  <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={s.headerTitle}>Хамтарсан хөтөлбөр</Text>
          </View>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={{ marginTop: 10 }}>Мэдээлэл татаж байна...</Text>
        </View>
      ) : error && programs.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={50} color="red" />
          <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={programs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={s.taskCard}
              onPress={() => openProgramDetail(item)}
              activeOpacity={0.7}
            >
              <View style={s.taskHeader}>
                <View style={s.iconContainer}>
                  <Ionicons name="earth-outline" size={30} color={PRIMARY_COLOR} />
                </View>
                <View style={s.taskInfo}>
                  <Text style={s.taskTitle}>{item.mergejil_Ner}</Text>
                  <Text style={s.taskSubtitle}>
                    {item.mergejil_Kod} • {item.totalPrograms} хөтөлбөр
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={() => (
            <View style={s.center}>
              <Text style={{ color: '#999' }}>Мэргэжлийн мэдээлэл олдсонгүй</Text>
            </View>
          )}
        />
      )}

      {/* Detail hesg */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>
                {selectedProgram?.mergejil_Ner}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={s.closeButton}
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={s.modalScroll}>
              {selectedProgram && getRelatedCollabs(selectedProgram._id).length === 0 ? (
                <Text style={s.noCollabsText}>
                  Одоогоор энэ мэргэжлээр хамтарсан хөтөлбөр оруулаагүй байна.
                </Text>
              ) : (
                selectedProgram && getRelatedCollabs(selectedProgram._id).map((collab) => (
                  <View key={collab._id} style={s.collabItem}>
                    <View style={s.collabHeader}>
                      <Ionicons name="location-outline" size={18} color={PRIMARY_COLOR} />
                      <Text style={s.collabCountry}>{collab.uls}</Text>
                    </View>
                    <Text style={s.collabUniversity}>{collab.surguuli}</Text>
                    <Text style={s.collabProgram}>{collab.hutulbur}</Text>
                    <View style={s.collabFooter}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={s.collabDuration}>{collab.hugatsaa}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity 
              style={s.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={s.doneButtonText}>хаах</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: { color: '#fff', fontSize: 16, marginLeft: -4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  collabItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  collabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  collabCountry: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginLeft: 6,
  },
  collabUniversity: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  collabProgram: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  collabFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collabDuration: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  doneButton: {
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noCollabsText: {
    padding: 20,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  }
});
