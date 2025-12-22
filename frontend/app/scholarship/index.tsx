import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { getTetgeleg } from '../../services/tetgelegService'; 
import { TetgelegType, TetgelegCategory, UITetgelegType } from '../../services/types';
import GroupAccordion from './GroupAccordion';

const PRIMARY_COLOR = '#3b5998';

const TABS = {
    TURIIN_TETGELEG: 'TuriinTetgeleg', 
    SURGUULIIN_TETGELEG: 'SurguuliinTetgeleg', 
} as const;

type TabName = typeof TABS[keyof typeof TABS];

const categorizeTetgelegClientSide = (item: TetgelegType): TetgelegCategory => {
    const ner = item.teteglegNer;
    if (ner.includes('Багш бэлтгэх') || ner.includes('ЕБС-ийн багш ажилтан') || ner.includes('Тэтгэлэгтэй багшлах')) {
        return 'ToriinSan';
    }
    if (ner.includes('Багш бус') || ner.includes('Сурлага, урлаг') || ner.includes('МУБИС-ийн захиралын')) {
        return 'Surguuli';
    }
    return 'ToriinSan'; 
};

const TetgelegScreen: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabName>(TABS.TURIIN_TETGELEG);
    const [tetgelegData, setTetgelegData] = useState<UITetgelegType[]>([]); 
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTetgeleg = async () => {
            setLoading(true);
            try {
                const dataFromBackend: TetgelegType[] = await getTetgeleg(); 
                const categorizedData: UITetgelegType[] = dataFromBackend.map((item) => {
                    const category: TetgelegCategory = categorizeTetgelegClientSide(item);
                    return { ...item, category };
                });
                setTetgelegData(categorizedData); 
                setError(null);
            } catch (err: any) {
                setError(`Өгөгдөл татаж чадсангүй.`);
            } finally {
                setLoading(false);
            }
        };
        fetchTetgeleg();
    }, []);
    
    const filteredData: UITetgelegType[] = tetgelegData.filter(item => 
        item.category === (activeTab === TABS.TURIIN_TETGELEG ? 'ToriinSan' : 'Surguuli')
    );

    const renderHeaderTabs = () => (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === TABS.TURIIN_TETGELEG && styles.activeTab]}
                onPress={() => setActiveTab(TABS.TURIIN_TETGELEG)}
            >
                <Text style={[styles.tabText, activeTab === TABS.TURIIN_TETGELEG && styles.activeTabText]}>
                    Төрийн Тэтгэлэг
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === TABS.SURGUULIIN_TETGELEG && styles.activeTab]}
                onPress={() => setActiveTab(TABS.SURGUULIIN_TETGELEG)}
            >
                <Text style={[styles.tabText, activeTab === TABS.SURGUULIIN_TETGELEG && styles.activeTabText]}>
                    Сургуулийн Тэтгэлэг
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.screenContainer}>
            <StatusBar style="light" />

            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.customHeader}>
                <View style={styles.headerInner}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Тэтгэлэг</Text>
                </View>
            </View>

            {/* tab */}
            {renderHeaderTabs()}
            
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <GroupAccordion tetgelegItem={item} />}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Идэвхтэй тэтгэлэг одоогоор байхгүй байна.</Text>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#fff' },

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

    tabContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        paddingHorizontal: 10,
        paddingTop: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tab: { 
        flex: 1,
        paddingVertical: 15, 
        alignItems: 'center',
        borderBottomWidth: 3, 
        borderBottomColor: 'transparent', 
    },
    activeTab: { borderBottomColor: PRIMARY_COLOR },
    tabText: { fontSize: 15, color: '#999', fontWeight: '700' },
    activeTabText: { color: PRIMARY_COLOR },

    listContainer: { padding: 16, paddingBottom: 40 },
    emptyText: { textAlign: 'center', marginTop: 60, fontSize: 15, color: '#999' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: '#e74c3c', textAlign: 'center' }
});

export default TetgelegScreen;