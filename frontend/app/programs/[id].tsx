import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'; 
import { StatusBar } from 'expo-status-bar';

import { getMergejilById } from '../../services/mergejilService'; 
import { ProgramDetailResponse, MergejilType } from '../../services/types'; 

const PRIMARY_COLOR = '#3b5998'; 
const BACKGROUND_COLOR = '#f5f7fa';

export default function ProgramDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    // ID shalgah
    const programId = Array.isArray(id) ? id[0] : (typeof id === 'string' ? id : undefined); 
    const validProgramId = programId && programId !== 'index' ? programId : undefined;

    const [detailData, setDetailData] = useState<ProgramDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const program: MergejilType | null | undefined = detailData?.mergejil;

    useEffect(() => {
        if (!validProgramId) {
            setIsLoading(false);
            setError("Мэргэжлийн ID олдсонгүй.");
            return;
        }

        const loadDetail = async () => {
            try {
                const data = await getMergejilById(validProgramId); 
                if (data && data.mergejil) setDetailData(data);
                else setError(`Мэдээлэл олдсонгүй.`);
            } catch {
                setError("Мэдээлэл татахад алдаа гарлаа.");
            } finally { setIsLoading(false); }
        };
        loadDetail();
    }, [validProgramId]); 

    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.customHeader}>
                <View style={styles.headerInner}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerTitle} numberOfLines={1}>Мэргэжил</Text>
                </View>
            </View>
            
            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
            ) : error || !program ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.errorBackBtn}>
                        <Text style={styles.backButtonText}>Буцах</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* mergejil ner */}
                    <Text style={styles.mainTitle}>{program.mergejil_Ner}</Text>

                    {/* vndsen medeelln card */}
                    <View style={styles.infoCard}>
                        <InfoRow icon="calendar-outline" label="Суралцах хугацаа" value={program.suraltsah_hugatsaa} />
                        <InfoRow icon="medal-outline" label="Нийт кредит" value={`${program.sudlah_kredit} кр`} />
                        <InfoRow 
                            icon="school-outline" 
                            label="Тэнхим" 
                            value={typeof program.tenhimId === 'object' ? program.tenhimId.ner : "Тодорхойгүй"} 
                        />
                        <InfoRow icon="barcode-outline" label="Мэргэжлийн код" value={program.mergejil_Kod} isLast={true} />
                    </View>

                    {/* tailbar */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Мэргэжлийн тухай</Text>
                        <View style={styles.divider} />
                        <Text style={styles.description}>{program.tailbar}</Text>
                    </View>

                    {/* hicheel */}
                    {program.hicheeluud && program.hicheeluud.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Судлах хичээлүүд</Text>
                            <View style={styles.divider} />
                            {program.hicheeluud.map((lesson, index) => (
                                <View key={index} style={styles.lessonItem}>
                                    <View style={styles.lessonMain}>
                                        <Text style={styles.lessonCode}>{lesson.code}</Text>
                                        <Text style={styles.lessonName} numberOfLines={2}>{lesson.name}</Text>
                                    </View>
                                    <View style={[styles.typeBadge, lesson.type === 'main' ? styles.mainBadge : styles.subBadge]}>
                                        <Text style={styles.typeText}>
                                            {lesson.type === 'main' ? 'Үндсэн' : 'Дагалдах'}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const InfoRow = ({ icon, label, value, isLast = false }: { icon: string, label: string, value: string, isLast?: boolean }) => (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
        <Ionicons name={icon as any} size={18} color={PRIMARY_COLOR} />
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    
    customHeader: {
        height: 120, 
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        paddingBottom: 15,
        paddingTop: Platform.OS === 'ios' ? 40 : 25,
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

    mainTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: PRIMARY_COLOR,
        textAlign: 'center',
        marginBottom: 25,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        lineHeight: 28,
    },

    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    rowLabel: { flex: 1, marginLeft: 12, fontSize: 14, color: '#666' },
    rowValue: { fontSize: 14, fontWeight: '700', color: '#333' },

    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: PRIMARY_COLOR,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
    description: { fontSize: 15, lineHeight: 24, color: '#444', textAlign: 'justify' },

    lessonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 10,
    },
    lessonMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    lessonCode: {
        fontSize: 10,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
        backgroundColor: '#eef4ff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 10,
        overflow: 'hidden',
    },
    lessonName: { fontSize: 14, color: '#333', fontWeight: '500', flex: 1 },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
    mainBadge: { backgroundColor: '#e3f2fd' },
    subBadge: { backgroundColor: '#eeeeee' },
    typeText: { fontSize: 10, fontWeight: '700', color: '#555' },

    errorText: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
    errorBackBtn: { marginTop: 20, backgroundColor: PRIMARY_COLOR, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 },
    backButtonText: { color: '#fff', fontWeight: 'bold' }
});