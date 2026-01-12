import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type MergejilType = {
    _id: string;
    mergejil_Kod: string;
    mergejil_Ner: string;
};

const API_BASE_URL = 'http://192.168.1.3:4000/api/mergejil';

const APP_COLORS = {
    primary: '#3b5998', 
    background: '#f9f9f9', 
    cardBackground: '#fff', 
    textTitle: '#333',
    textBody: '#777',
    iconDefault: '#999',
    cardBorder: '#eee',
};

const APP_LAYOUT = {
    spacing: 15,
    borderRadius: 10,
    cardHeight: 150,
};

// Program card component
function ProgramCard({ program, onPress }: { program: MergejilType; onPress: () => void }) {
    const codePrefix = program.mergejil_Kod.substring(0, 4); 
    let iconName: string;
    let iconColor: string;

    switch (codePrefix) {
        case "M.BI": iconName = "leaf-outline"; iconColor = "#27ae60"; break;
        case "M.MZ": iconName = "medkit-outline"; iconColor = "#e74c3c"; break;
        case "M.GR": iconName = "compass-outline"; iconColor = "#f39c12"; break;
        case "M.MA": iconName = "calculator-outline"; iconColor = "#2980b9"; break;
        case "M.PH": iconName = "nuclear-outline"; iconColor = "#8e44ad"; break; 
        case "M.IT": iconName = "people-outline"; iconColor = "#16a085"; break;
        case "M.CH": iconName = "flask-outline"; iconColor = "#d35400"; break;
        case "M.SW": iconName = "code-slash-outline"; iconColor = "#34495e"; break;
        default: iconName = "book-outline"; iconColor = APP_COLORS.primary; break;
    }

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Ionicons name={iconName as any} size={40} color={iconColor} />
            <Text style={styles.cardTitle}>{program.mergejil_Ner}</Text>
            <Text style={styles.cardCode}>{program.mergejil_Kod}</Text>
        </TouchableOpacity>
    );
}

export default function ProgramsScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [programs, setPrograms] = useState<MergejilType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await fetch(API_BASE_URL);
            const data = await response.json();
            setPrograms(data.data || data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrograms = programs.filter((p) =>
        p.mergejil_Ner.toLowerCase().includes(searchText.toLowerCase()) ||
        p.mergejil_Kod.includes(searchText)
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={APP_COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.screenContainer}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.customHeader}>
                <View style={styles.headerInner}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Мэргэжил</Text>
                </View>
            </View>

            {/* search */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={APP_COLORS.iconDefault} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Мэргэжлийн нэр, код..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.gridContainer}>
                    {filteredPrograms.length === 0 ? (
                        <Text style={styles.noDataText}>Тохирох мэргэжил олдсонгүй.</Text>
                    ) : (
                        filteredPrograms.map((program) => (
                            <ProgramCard
                                key={program._id}
                                program={program}
                                onPress={() => router.push(`/programs/${program._id}`)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: APP_COLORS.background },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    
    customHeader: {
        height: 120, 
        backgroundColor: APP_COLORS.primary,
        justifyContent: 'center',
        paddingBottom: 15,
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
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
    backText: { color: '#fff', fontSize: 16 },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: APP_COLORS.cardBackground,
        marginHorizontal: APP_LAYOUT.spacing,
        marginTop: APP_LAYOUT.spacing,
        borderRadius: APP_LAYOUT.borderRadius,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        marginLeft: 8,
    },

    scrollContent: {
        paddingHorizontal: APP_LAYOUT.spacing,
        paddingTop: APP_LAYOUT.spacing,
        paddingBottom: 30,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: "48%",
        backgroundColor: APP_COLORS.cardBackground,
        padding: 20,
        borderRadius: APP_LAYOUT.borderRadius,
        marginBottom: APP_LAYOUT.spacing,
        alignItems: "center",
        height: APP_LAYOUT.cardHeight,
        borderWidth: 1,
        borderColor: APP_COLORS.cardBorder,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        color: APP_COLORS.textTitle,
        marginTop: 10,
        marginBottom: 6,
    },
    cardCode: { fontSize: 12, color: APP_COLORS.textBody },
    noDataText: { width: "100%", textAlign: "center", marginTop: 40, color: APP_COLORS.textBody },
});