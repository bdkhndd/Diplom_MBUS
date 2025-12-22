import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity,
    Linking,
    Platform,
    ActivityIndicator,
    TextInput,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { getContactInfo, sendFeedback, ContactInfoType, FeedbackType } from '@/services/contactinfoService';

const COLORS = {
    primary: '#3b5998',
    success: '#4CAF50',
    background: '#F5F7FA',
    white: '#FFFFFF',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#E1E8ED',
    danger: '#F44336',
};

interface ContactItemProps {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    color?: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, title, subtitle, onPress, color = COLORS.primary }) => (
    <TouchableOpacity style={styles.contactCard} onPress={onPress}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon as any} size={28} color={color} />
        </View>
        <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>{title}</Text>
            <Text style={styles.contactSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
);

export default function ContactScreen() {
    const [contactInfo, setContactInfo] = useState<ContactInfoType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    // Form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadContactInfo();
    }, []);

    const loadContactInfo = async () => {
        setIsLoading(true);
        try {
            const data = await getContactInfo();
            setContactInfo(data);
        } catch (error: any) {
            Alert.alert('Алдаа', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhone = () => {
        if (contactInfo?.phone) {
            Linking.openURL(`tel:${contactInfo.phone}`);
        }
    };

    const handleEmail = () => {
        if (contactInfo?.email) {
            Linking.openURL(`mailto:${contactInfo.email}`);
        }
    };

    const handleWebsite = () => {
        if (contactInfo?.website) {
            Linking.openURL(contactInfo.website);
        }
    };

    const handleLocation = () => {
        if (contactInfo?.location) {
            const { latitude, longitude } = contactInfo.location;
            const label = 'МУБИС';
            
            const scheme = Platform.select({
                ios: 'maps:0,0?q=',
                android: 'geo:0,0?q='
            });
            const url = Platform.select({
                ios: `${scheme}${label}@${latitude},${longitude}`,
                android: `${scheme}${latitude},${longitude}(${label})`
            });
            
            if (url) {
                Linking.openURL(url);
            }
        }
    };

    const handleFacebook = () => {
        if (contactInfo?.facebook) {
            Linking.openURL(contactInfo.facebook);
        }
    };

    const handleInstagram = () => {
        if (contactInfo?.instagram) {
            Linking.openURL(contactInfo.instagram);
        }
    };

    const handleSubmitFeedback = async () => {
        // Validation
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            Alert.alert('Анхааруулга', 'Шаардлагатай талбаруудыг бөглөнө үү');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Анхааруулга', 'И-мэйл хаяг буруу байна');
            return;
        }

        setIsSending(true);
       try {
        const feedback = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            subject: subject.trim(),
            message: message.trim()
        };

        const result = await sendFeedback(feedback);
        
        if (result) {
            Alert.alert(
                'Амжилттай',
                'Таны санал хүсэлтийг хүлээн авлаа.',
                [{ text: 'OK', onPress: () => {
                    setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
                    setShowFeedbackForm(false);
                }}]
            );
        }
    } catch (error: any) {
        Alert.alert('Алдаа', error.message);
    } finally {
        setIsSending(false);
    }
};

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen 
                    options={{ 
                        headerTitle: 'Холбоо барих',
                        headerStyle: { backgroundColor: COLORS.primary },
                        headerTintColor: COLORS.white,
                    }} 
                />
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Уншиж байна...</Text>
            </View>
        );
    }

    if (showFeedbackForm) {
        return (
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Stack.Screen 
                    options={{ 
                        headerTitle: 'Санал хүсэлт илгээх',
                        headerStyle: { backgroundColor: COLORS.primary },
                        headerTintColor: COLORS.white,
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => setShowFeedbackForm(false)} style={{ marginLeft: 10 }}>
                                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        ),
                    }} 
                />
                
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <Ionicons name="mail-outline" size={40} color={COLORS.primary} />
                            <Text style={styles.formTitle}>Санал хүсэлт илгээх</Text>
                            <Text style={styles.formSubtitle}>
                                Таны санал хүсэлт бидэнд чухал. Асуулт, санал хүсэлтээ бидэнд илгээнэ үү.
                            </Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Нэр <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Таны нэр"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>И-мэйл <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@email.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
 
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Утас</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="99112233"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Гарчиг <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Санал хүсэлтийн гарчиг"
                                value={subject}
                                onChangeText={setSubject}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Мессеж <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Санал хүсэлтээ энд бичнэ үү..."
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitButton, isSending && styles.submitButtonDisabled]}
                            onPress={handleSubmitFeedback}
                            disabled={isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons name="send" size={20} color={COLORS.white} />
                                    <Text style={styles.submitButtonText}>Илгээх</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen 
                options={{ 
                    headerTitle: 'Холбоо барих',
                    headerStyle: { backgroundColor: COLORS.primary },
                    headerTintColor: COLORS.white,
                    headerShadowVisible: false,
                }} 
            />
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header  */}
                <View style={styles.headerCard}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="school" size={64} color={COLORS.primary} />
                    </View>
                    <Text style={styles.universityName}>
                        МАТЕМАТИК, БАЙГАЛИЙН УХААНЫ СУРГУУЛЬ
                    </Text>
                </View>

                {/* holboo barih */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Холбоо барих</Text>
                    
                    {contactInfo && (
                        <>
                            <ContactItem
                                icon="call"
                                title="Утас"
                                subtitle={contactInfo.phone}
                                onPress={handlePhone}
                                color="#4CAF50"
                            />
                            
                            <ContactItem
                                icon="mail"
                                title="И-мэйл"
                                subtitle={contactInfo.email}
                                onPress={handleEmail}
                                color="#FF9800"
                            />
                            
                            <ContactItem
                                icon="globe"
                                title="Вэбсайт"
                                subtitle={contactInfo.website}
                                onPress={handleWebsite}
                                color={COLORS.primary}
                            />
                            
                            <ContactItem
                                icon="location"
                                title="Хаяг"
                                subtitle={contactInfo.address}
                                onPress={handleLocation}
                                color="#F44336"
                            />
                        </>
                    )}
                </View>

                {/* social hayg*/}
                {contactInfo?.facebook || contactInfo?.instagram ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Сошиал хаяг</Text>
                        
                        {contactInfo.facebook && (
                            <ContactItem
                                icon="logo-facebook"
                                title="Facebook"
                                subtitle={contactInfo.facebook}
                                onPress={handleFacebook}
                                color="#1877F2"
                            />
                        )}
                        
                        {contactInfo.instagram && (
                            <ContactItem
                                icon="logo-instagram"
                                title="Instagram"
                                subtitle={contactInfo.instagram}
                                onPress={handleInstagram}
                                color="#E4405F"
                            />
                        )}
                    </View>
                ) : null}

                {/*ajiliin tsag */}
                {contactInfo?.workingHours && (
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.infoTitle}>Ажлын цаг</Text>
                        </View>
                        <View style={styles.infoContent}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Даваа - Баасан:</Text>
                                <Text style={styles.infoValue}>{contactInfo.workingHours.weekdays}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Бямба, Ням:</Text>
                                <Text style={styles.infoValue}>{contactInfo.workingHours.weekend}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* holbogdoh baiguulga */}
                {contactInfo?.departments && contactInfo.departments.length > 0 && (
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Ionicons name="business-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.infoTitle}>Салбар байгууллагууд</Text>
                        </View>
                        <View style={styles.infoContent}>
                            {contactInfo.departments.map((dept, index) => (
                                <View key={index} style={styles.departmentItem}>
                                    <View style={styles.departmentDot} />
                                    <View style={styles.departmentContent}>
                                        <Text style={styles.departmentName}>{dept.name}</Text>
                                        <Text style={styles.departmentPhone}>{dept.phone}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* butsah */}
                <TouchableOpacity 
                    style={styles.feedbackButton}
                    onPress={() => setShowFeedbackForm(true)}
                >
                    <Ionicons name="chatbubbles" size={24} color={COLORS.white} />
                    <Text style={styles.feedbackButtonText}>Санал хүсэлт илгээх</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </TouchableOpacity>

                {/* App version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                    <Text style={styles.versionSubtext}>© 2024 МУБИС. Бүх эрх хуулиар хамгаалагдсан.</Text>
                </View>
            </ScrollView>
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
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    universityName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    universityNameEn: {
        fontSize: 13,
        color: COLORS.textLight,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactContent: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    contactSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    
    infoCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    infoContent: {
        paddingLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    infoValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    
    // Department
    departmentItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
        gap: 12,
    },
    departmentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginTop: 6,
    },
    departmentContent: {
        flex: 1,
    },
    departmentName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    departmentPhone: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    
    // Feedback Button
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
    },
    feedbackButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
        flex: 1,
        textAlign: 'center',
    },
    
    // Form
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    formHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 12,
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    required: {
        color: COLORS.danger,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: COLORS.text,
        backgroundColor: COLORS.white,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    
    // Version
    versionContainer: {
        alignItems: 'center',
        paddingTop: 16,
    },
    versionText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    versionSubtext: {
        fontSize: 11,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});