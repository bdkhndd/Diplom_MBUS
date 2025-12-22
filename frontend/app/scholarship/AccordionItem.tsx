import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { UITetgelegType, MergejilTypeSimple } from '../../services/types'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
    tetgeleg: UITetgelegType;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ tetgeleg }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const isPopulated = tetgeleg.meregjilId && tetgeleg.meregjilId.length > 0 && typeof tetgeleg.meregjilId[0] === 'object';
    const populatedMergejil = isPopulated ? (tetgeleg.meregjilId as MergejilTypeSimple[]) : [];

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={[styles.row, expanded && styles.activeRow]} 
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <Text style={[styles.title, expanded && styles.activeTitle]}>{tetgeleg.teteglegNer}</Text>
                <Ionicons 
                    name={expanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={expanded ? "#3b5998" : "#8e8e93"} 
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.child}>
                    <DetailRow label="Шаардлага" value={tetgeleg.shaardlag} />
                    <DetailRow  label="Босго Оноо"  value={tetgeleg.bosgo_Onoo ? `${tetgeleg.bosgo_Onoo}` : "0"} />
                    <DetailRow label="Хэмжээ" value={tetgeleg.teteglegiin_Hemjee ? `${tetgeleg.teteglegiin_Hemjee}%` : "0%"} />
                    <DetailRow label="Хугацаа" value={tetgeleg.hugatsaa} isLast={populatedMergejil.length === 0} />
                    
                    {populatedMergejil.length > 0 && (
                        <View style={styles.subDetail}>
                            <Text style={styles.subTitle}>✅ Холбоотой мэргэжлүүд:</Text>
                            {populatedMergejil.map((m) => (
                                <View key={m._id} style={styles.bulletItem}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.subDetailText}>{m.mergejil_Ner}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

// medeelln mur
const DetailRow = ({ label, value, isLast = false }: { label: string, value: string, isLast?: boolean }) => (
    <View style={[styles.detailRow, !isLast && styles.divider]}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value || "Тодорхойгүй"}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#fff', 
        marginVertical: 8, 
        borderRadius: 12, 
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 16,
        paddingHorizontal: 18, 
        alignItems: 'center', 
        backgroundColor: '#fff', 
    },
    activeRow: {
        backgroundColor: '#f8faff', // Нээгдсэн үед арын өнгө нь ялгарна
    },
    title: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    activeTitle: {
        color: '#3b5998', // Нээгдсэн үед гарчиг цэнхэр болно
    },
    child: { 
        backgroundColor: '#fff', 
        paddingHorizontal: 18,
        paddingBottom: 18,
    },
    detailRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    detailLabel: { 
        fontSize: 13, 
        color: '#8e8e93', 
        width: 100,
        fontWeight: '500'
    },
    detailValue: { 
        fontSize: 14, 
        color: '#333', 
        flex: 1,
        lineHeight: 20,
        fontWeight: '400'
    },
    subDetail: { 
        marginTop: 10, 
        paddingTop: 15, 
        borderTopWidth: 1, 
        borderTopColor: '#f0f0f0' 
    },
    subTitle: { 
        fontSize: 13,
        fontWeight: '700', 
        marginBottom: 10, 
        color: '#3b5998',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        paddingLeft: 5
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3b5998',
        marginRight: 10
    },
    subDetailText: { 
        fontSize: 13, 
        color: '#555',
        flex: 1
    }
});

export default AccordionItem;