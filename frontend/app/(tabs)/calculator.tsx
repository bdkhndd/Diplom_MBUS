import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    Alert,
    ActivityIndicator,
    Platform,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { Stack } from 'expo-router';

// Төрлүүд болон дата татах сервисийг импортлох
import { MergejilType, LessonType, TetgelegType } from '@/services/types';
import { fetchCalculatorData } from '@/services/calculatorService';

// Өнгөний тогтмол утгууд
const COLORS = {
    primary: '#3b5998',
    primaryDark: '#2d4373',
    accent: '#4CAF50',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    background: '#F5F7FA',
    white: '#FFFFFF',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#E1E8ED',
    cardShadow: '#000',
    modalOverlay: 'rgba(0,0,0,0.5)',
};

// Хэрэглэгчийн оруулсан онооны интерфэйс
interface UserScore {
    code: string; 
    name: string;
    score: number | null;
}

// Тооцооллын үр дүнгийн интерфэйс
interface CalculationResult {
    mergejil: MergejilType;
    isEligible: boolean;
    missingScore: { lessonName: string, needed: number }[];
    eligibleTetgeleg: TetgelegType[];
}

export default function CalculatorScreen() {
    // Төлөвүүдийг (States) тодорхойлох
    const [isLoading, setIsLoading] = useState(true);
    const [allData, setAllData] = useState<{ mergejil: MergejilType[]; tetgeleg: TetgelegType[] }>({ 
        mergejil: [], 
        tetgeleg: [] 
    });
    
    // Анхны хичээлийн жагсаалт (3 хичээл)
    const initialLessons: UserScore[] = [
        { code: '', name: 'Хичээл сонгох', score: null }, 
        { code: '', name: 'Хичээл сонгох', score: null },
        { code: '', name: 'Хичээл сонгох', score: null }, 
    ];
    
    const [userScores, setUserScores] = useState<UserScore[]>(initialLessons);
    const [calculationResults, setCalculationResults] = useState<CalculationResult[]>([]);
    const [isResultExpanded, setIsResultExpanded] = useState<string | null>(null);
    
    // Modal-ын төлөв
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

    // Урьдчилан тодорхойлсон хичээлүүдийн жагсаалт
    const predefinedLessons: LessonType[] = [
        { code: 'math', name: 'Математик', type: 'main' },
        { code: 'physical', name: 'Физик', type: 'main' },
        { code: 'chemistry', name: 'Хими', type: 'main' },
        { code: 'biology', name: 'Биологи', type: 'main' },
        { code: 'geography', name: 'Газарзүй', type: 'main' },
        { code: 'english', name: 'Англи хэл', type: 'main' },
        { code: 'sociology', name: 'Нийгэм', type: 'main' },
    ];

    // Өгөгдөл серверээс татах
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const res = await fetchCalculatorData();
                if (res.success && res.data) {
                    setAllData(res.data);
                    console.log('📦 Тэтгэлэг татагдсан:', res.data.tetgeleg.length);
                } else {
                    Alert.alert('Алдаа', `Өгөгдөл татаж чадсангүй: ${res.message}`);
                }
            } catch (error: any) {
                Alert.alert('Алдаа', 'Сүлжээний холболт тасарсан байна');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const openLessonModal = (index: number) => {
        setSelectedLessonIndex(index);
        setIsModalVisible(true);
    };

    // Жагсаалтаас хичээл сонгох үед ажиллах
    const handleLessonSelect = (lessonCode: string) => {
        if (selectedLessonIndex === null) return;

        const lesson = predefinedLessons.find(l => l.code === lessonCode);

        setUserScores(prev => {
            const updated = [...prev];

            // Сонгогдсон хичээл байгаа эсэхийг шалгах
            if (prev.some((u, i) => u.code === lessonCode && i !== selectedLessonIndex)) {
                Alert.alert("Анхааруулга", "Энэ хичээлийг аль хэдийн сонгосон байна");
                return prev;
            }

            updated[selectedLessonIndex] = {
                code: lesson?.code || '',
                name: lesson?.name || 'Хичээл сонгох',
                score: prev[selectedLessonIndex].score,
            };

            return updated;
        });

        setIsModalVisible(false);
    };

    // Оноо өөрчлөгдөх үед ажиллах функц
    const handleScoreChange = (index: number, text: string) => {
        const score = text ? parseInt(text) : null;

        setUserScores(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], score };
            return updated;
        });
    };

    // Элсэх боломжтой эсэхийг тооцоолох 
    const calculateEligibility = () => {
        const validScores = userScores.filter(s => s.code !== '' && s.score !== null && !isNaN(s.score));

        // Дор хаяж 2 хичээл оруулсан байх шаардлагатай
        if (validScores.length < 2) {
            Alert.alert("Уучлаарай", "Та дор хаяж 2 хичээлийн оноог зөв оруулсан байх ёстой.");
            setCalculationResults([]);
            return;
        }

        const allUserScores: { [key: string]: number } = userScores.reduce((acc, curr) => {
            if (curr.score !== null) acc[curr.code] = curr.score;
            return acc;
        }, {} as { [key: string]: number });

        // 490-өөс дээш оноо авсан хичээлүүдийг шүүх
        const passedLessons = Object.entries(allUserScores)
            .filter(([_, score]) => score >= 490)
            .map(([code]) => code);

        if (passedLessons.length >= 2) {
            const results: CalculationResult[] = allData.mergejil
                .filter(mergejil => {
                    // Мэргэжилд хамааралтай хичээлүүдийг шалгах
                    const relatedLessons = mergejil.hicheeluud.map(h => h.code);
                    const relatedPassed = relatedLessons.filter(code =>
                        passedLessons.includes(code)
                    );
                    const hasMain = mergejil.hicheeluud.some(lesson => 
                        relatedPassed.includes(lesson.code)
                    );
                    const hasTwoRelated = relatedPassed.length >= 2;

                    return hasMain && hasTwoRelated;
                })
                .map(mergejil => {  
                    let isEligible = true;
                    let missingScore: { lessonName: string, needed: number }[] = [];

                    const requiredLessons = mergejil.hicheeluud.filter(h => h.type === 'main');

                    // Босго оноо хүрсэн эсэхийг шалгах
                    for (const lesson of requiredLessons) {
                        const userScore = allUserScores[lesson.code] || 0;
                        if (userScore < mergejil.minScore) {
                            isEligible = false;
                            missingScore.push({
                                lessonName: lesson.name,
                                needed: mergejil.minScore - userScore
                            });
                        }
                    }
                    // Тэтгэлэгт хамрагдах боломжтой эсэхийг шалгах
                    let eligibleTetgeleg: TetgelegType[] = [];
                    
                    if (isEligible) {
                        const totalScore = Object.values(allUserScores).reduce((a, b) => a + b, 0);
                        const averageScore = validScores.length > 0 ? totalScore / validScores.length : 0;

                        console.log(`🎓 ${mergejil.mergejil_Ner}: Дундаж оноо = ${averageScore.toFixed(2)}`);

                        eligibleTetgeleg = allData.tetgeleg.filter(tetgeleg => {
                            const mergejilIds = tetgeleg.meregjilId || tetgeleg.meregjilId || [];
                            
                            const appliesToCurrentMajor = mergejilIds.some((idOrObject: any) => {
                                const currentId = typeof idOrObject === 'string'
                                    ? idOrObject
                                    : (idOrObject?._id || idOrObject?.$oid);
                                
                                const matches = currentId === mergejil._id;
                                
                                if (matches) {
                                    console.log(`  ✅ Тэтгэлэг олдсон: ${tetgeleg.teteglegNer}`);
                                }
                                
                                return matches;
                            });

                            const meetsScore = averageScore >= tetgeleg.bosgo_Onoo;
                            
                            return appliesToCurrentMajor && meetsScore;
                        });

                        console.log(`  📊 Нийт боломжтой тэтгэлэг: ${eligibleTetgeleg.length}`);
                    }

                    return { mergejil, isEligible, missingScore, eligibleTetgeleg };
                });

            // Үр дүнг эрэмбэлэх (Боломжтой мэргэжлүүд нь эхэндээ)
            const sortedResults = results.sort((a, b) => {
                if (a.isEligible && !b.isEligible) return -1;
                if (!a.isEligible && b.isEligible) return 1;
                return 0;
            });

            setCalculationResults(sortedResults);
        } else {
            Alert.alert("Уучлаарай", "Та 2-оос дээш хичээлд 490+ оноо авсан байх ёстой.");
            setCalculationResults([]);
        }
    };

    // Оноо болон үр дүнг цэвэрлэх функц
    const handleReset = () => {
        setUserScores(initialLessons);
        setCalculationResults([]);
        setIsResultExpanded(null);
    };

    // Ачаалж буй төлөв харуулах
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ 
                    headerTitle: 'Элсэлтийн Тооцоолуур',
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: COLORS.white,
                }} />
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Өгөгдөл татаж байна...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ 
                headerTitle: 'Элсэлтийн Тооцоолуур',
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.white,
                headerShadowVisible: false,
            }} />
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Толгой хэсгийн карт */}
                <View style={styles.headerCard}>
                    <Ionicons name="school-outline" size={48} color={COLORS.primary} />
                    <Text style={styles.headerTitle}>Элсэлтийн Тооцоолуур</Text>
                    <Text style={styles.headerSubtitle}>
                        Та ЭЕШ-ийн оноогоо оруулан элсэх боломжтой мэргэжлүүдээ харна уу
                    </Text>
                </View>

                {/* Оноо оруулах хэсэг */}
                <View style={styles.inputCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="create-outline" size={22} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>ЭЕШ-ийн оноо оруулах</Text>
                    </View>
                    
                    {userScores.map((item, index) => (
                        <View key={index} style={styles.inputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Хичээл {index + 1}</Text>
                                <TouchableOpacity
                                    style={styles.selectButton}
                                    onPress={() => openLessonModal(index)}
                                >
                                    <Text style={[
                                        styles.selectButtonText,
                                        !item.code && styles.selectButtonTextPlaceholder
                                    ]}>
                                        {item.name}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.scoreInputWrapper}>
                                <Text style={styles.inputLabel}>Оноо</Text>
                                <TextInput
                                    style={[
                                        styles.scoreInput,
                                        !item.code && styles.scoreInputDisabled
                                    ]}
                                    keyboardType="numeric"
                                    placeholder="000"
                                    placeholderTextColor={COLORS.textLight}
                                    value={item.score !== null ? item.score.toString() : ''}
                                    onChangeText={(text) => handleScoreChange(index, text)}
                                    editable={!!item.code}
                                    maxLength={3}
                                />
                            </View>
                        </View>
                    ))}

                    {/* Тооцоолох болон Цэвэрлэх товчлуур */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={[styles.button, styles.calculateButton]} 
                            onPress={calculateEligibility}
                        >
                            <Ionicons name="calculator-outline" size={20} color={COLORS.white} />
                            <Text style={styles.buttonText}>Тооцоолох</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.button, styles.resetButton]} 
                            onPress={handleReset}
                        >
                            <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
                            <Text style={[styles.buttonText, { color: COLORS.primary }]}>Цэвэрлэх</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Тооцооллын үр дүн харуулах хэсэг */}
                {calculationResults.length > 0 && (
                    <View style={styles.resultsSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="bar-chart-outline" size={22} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>
                                Элсэх боломжтой ({calculationResults.length} мэргэжил)
                            </Text>
                        </View>
                        
                        {calculationResults.map((result, index) => (
                            <View key={result.mergejil._id} style={styles.resultCard}>
                                <TouchableOpacity
                                    style={[
                                        styles.resultHeader,
                                        { backgroundColor: result.isEligible ? COLORS.success : COLORS.danger }
                                    ]}
                                    onPress={() => setIsResultExpanded(
                                        isResultExpanded === result.mergejil._id ? null : result.mergejil._id
                                    )}
                                >
                                    <View style={styles.resultHeaderLeft}>
                                        <View style={styles.resultNumber}>
                                            <Text style={styles.resultNumberText}>{index + 1}</Text>
                                        </View>
                                        <View style={styles.resultTitleWrapper}>
                                            <Text style={styles.resultTitle} numberOfLines={2}>
                                                {result.mergejil.mergejil_Ner}
                                            </Text>
                                            <View style={styles.resultBadge}>
                                                <Ionicons 
                                                    name={result.isEligible ? "checkmark-circle" : "close-circle"} 
                                                    size={14} 
                                                    color={COLORS.white} 
                                                />
                                                <Text style={styles.resultBadgeText}>
                                                    {result.isEligible ? 'Элсэх боломжтой' : 'Шаардлага хангахгүй'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name={isResultExpanded === result.mergejil._id ? 'chevron-up' : 'chevron-down'}
                                        size={24}
                                        color={COLORS.white}
                                    />
                                </TouchableOpacity>

                                {/* Дэлгэрэнгүй мэдээлэл (Дэлгэсэн үед) */}
                                {isResultExpanded === result.mergejil._id && (
                                    <View style={styles.resultDetail}>
                                        <View style={styles.detailSection}>
                                            <View style={styles.detailRow}>
                                                <Ionicons name="code-outline" size={16} color={COLORS.textLight} />
                                                <Text style={styles.detailLabel}>Код:</Text>
                                                <Text style={styles.detailValue}>{result.mergejil.mergejil_Kod}</Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
                                                <Text style={styles.detailLabel}>Хугацаа:</Text>
                                                <Text style={styles.detailValue}>{result.mergejil.suraltsah_hugatsaa}</Text>
                                            </View>
                                        </View>

                                        {/* Дутуу онооны мэдэгдэл */}
                                        {!result.isEligible && result.missingScore.length > 0 && (
                                            <View style={styles.missingScoreBox}>
                                                <View style={styles.boxHeader}>
                                                    <Ionicons name="warning-outline" size={18} color={COLORS.warning} />
                                                    <Text style={styles.boxTitle}>Дутуу оноо</Text>
                                                </View>
                                                {result.missingScore.map((m, i) => (
                                                    <View key={i} style={styles.missingItem}>
                                                        <View style={styles.missingDot} />
                                                        <Text style={styles.missingText}>
                                                            {m.lessonName}: <Text style={styles.missingValue}>{m.needed} оноо</Text>
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}

                                        {/* Тэтгэлгийн мэдээлэл */}
                                        <View style={styles.scholarshipBox}>
                                            <View style={styles.boxHeader}>
                                                <Ionicons name="gift-outline" size={18} color={COLORS.success} />
                                                <Text style={styles.boxTitle}>
                                                    Тэтгэлэгт хамрагдах боломж ({result.eligibleTetgeleg.length})
                                                </Text>
                                            </View>
                                            {result.eligibleTetgeleg.length > 0 ? (
                                                result.eligibleTetgeleg.map((t, i) => (
                                                    <View key={t._id} style={styles.scholarshipItem}>
                                                        <View style={styles.scholarshipNumber}>
                                                            <Text style={styles.scholarshipNumberText}>{i + 1}</Text>
                                                        </View>
                                                        <View style={styles.scholarshipContent}>
                                                            <Text style={styles.scholarshipName}>
                                                                {t.teteglegNer}
                                                            </Text>
                                                            <Text style={styles.scholarshipDetail}>
                                                                Хэмжээ: {t.teteglegiin_Hemjee}
                                                            </Text>
                                                            <Text style={styles.scholarshipDetail}>
                                                                Шаардлага: {t.shaardlag}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.emptyText}>
                                                    Таны оноогоор хамрагдах боломжтой тэтгэлэг байхгүй байна
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}
                
                {/* Хоосон үеийн төлөв */}
                {calculationResults.length === 0 && !isLoading && (
                    <View style={styles.emptyState}>
                        <Ionicons name="calculator-outline" size={64} color={COLORS.textLight} />
                        <Text style={styles.emptyStateText}>
                            Оноогоо оруулаад "Тооцоолох" товч дарна уу
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Хичээл сонгох Modal */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Хичээл сонгох</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={28} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalList}>
                            {predefinedLessons.map((lesson) => {
                                const isSelected = selectedLessonIndex !== null && 
                                    userScores[selectedLessonIndex]?.code === lesson.code;
                                const isAlreadyUsed = userScores.some(
                                    (u, i) => u.code === lesson.code && i !== selectedLessonIndex
                                );
                                
                                return (
                                    <TouchableOpacity
                                        key={lesson.code}
                                        style={[
                                            styles.modalItem,
                                            isSelected && styles.modalItemSelected,
                                            isAlreadyUsed && styles.modalItemDisabled
                                        ]}
                                        onPress={() => !isAlreadyUsed && handleLessonSelect(lesson.code)}
                                        disabled={isAlreadyUsed}
                                    >
                                        <Text style={[
                                            styles.modalItemText,
                                            isSelected && styles.modalItemTextSelected,
                                            isAlreadyUsed && styles.modalItemTextDisabled
                                        ]}>
                                            {lesson.name}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                        )}
                                        {isAlreadyUsed && (
                                            <Text style={styles.usedBadge}>Сонгосон</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textLight,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    
    headerCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 12,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },
    
    inputCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginLeft: 8,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    
    selectButton: {
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    selectButtonText: {
        fontSize: 15,
        color: COLORS.text,
        fontWeight: '500',
    },
    selectButtonTextPlaceholder: {
        color: COLORS.textLight,
    },
    
    scoreInputWrapper: {
        width: 100,
    },
    scoreInput: {
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: COLORS.text,
        backgroundColor: COLORS.white,
    },
    scoreInputDisabled: {
        backgroundColor: COLORS.background,
        color: COLORS.textLight,
    },
    
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 6,
    },
    calculateButton: {
        backgroundColor: COLORS.primary,
    },
    resetButton: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.white,
    },
    
    resultsSection: {
        marginBottom: 16,
    },
    resultCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    resultHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    resultNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    resultTitleWrapper: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 4,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resultBadgeText: {
        fontSize: 12,
        color: COLORS.white,
        opacity: 0.9,
    },
    
    resultDetail: {
        padding: 16,
        backgroundColor: COLORS.background,
    },
    detailSection: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    
    missingScoreBox: {
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
    },
    boxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    boxTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    missingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 8,
    },
    missingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.warning,
    },
    missingText: {
        fontSize: 13,
        color: COLORS.text,
    },
    missingValue: {
        fontWeight: '700',
        color: COLORS.warning,
    },
    
    scholarshipBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
    },
    scholarshipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 8,
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    scholarshipNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scholarshipNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.white,
    },
    scholarshipContent: {
        flex: 1,
    },
    scholarshipName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    scholarshipDetail: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    emptyText: {
        fontSize: 13,
        color: COLORS.textLight,
        fontStyle: 'italic',
        marginTop: 4,
    },
    
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 20,
    },
    
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.modalOverlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    modalList: {
        padding: 8,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 12,
        backgroundColor: COLORS.background,
    },
    modalItemSelected: {
        backgroundColor: COLORS.primary + '15',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    modalItemDisabled: {
        backgroundColor: COLORS.border,
        opacity: 0.5,
    },
    modalItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
    },
    modalItemTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    modalItemTextDisabled: {
        color: COLORS.textLight,
    },
    usedBadge: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '600',
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
});