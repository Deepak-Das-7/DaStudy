import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";

import { api } from "../src/services/api";
import type { SubjectItem, SubjectsResponse } from "../src/types/subject";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
} from "../src/constants/theme";
import { API_ENDPOINTS } from "../src/constants/api";

// Extracted SubjectCard component with its own animations
const SubjectCard = ({
    item,
    index,
    onPress,
}: {
    item: SubjectItem;
    index: number;
    onPress: (subjectId: string, subjectName: string) => void;
}) => {
    const bgColor = getSubjectColor(item.name);
    const emoji = getSubjectEmoji(item.name);
    const delay = index * 80;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
            }}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.subjectCard,
                    { borderLeftColor: bgColor },
                    pressed && styles.subjectCardPressed,
                ]}
                onPress={() => onPress(item._id, item.name)}
            >
                <View style={[styles.subjectIcon, { backgroundColor: bgColor }]}>
                    <Text style={styles.subjectIconEmoji}>{emoji}</Text>
                </View>

                <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{item.name}</Text>
                    <Text style={styles.subjectSubtitle}>
                        View chapters →
                    </Text>
                </View>

                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

// Helper function for emoji mapping (kept outside component)
const getSubjectEmoji = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("math")) return "🔢";
    if (n.includes("physics")) return "⚛️";
    if (n.includes("chemistry")) return "🧪";
    if (n.includes("biology")) return "🧬";
    if (n.includes("science")) return "🔬";
    if (n.includes("english")) return "📖";
    if (n.includes("hindi")) return "📚";
    if (n.includes("history")) return "📜";
    if (n.includes("geo")) return "🌍";
    if (n.includes("social")) return "🏛️";
    if (n.includes("economics")) return "📊";
    if (n.includes("account")) return "🧮";
    if (n.includes("business")) return "💼";
    if (n.includes("computer")) return "💻";
    return "📘";
};

export default function SubjectsScreen() {
    const { classId, classNumber } = useLocalSearchParams<{
        classId?: string;
        classNumber?: string;
    }>();

    const [subjects, setSubjects] = useState<SubjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSubjects = async (): Promise<void> => {
        if (!classId) {
            setError("Class information is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await api.get<SubjectsResponse>(
                API_ENDPOINTS.SUBJECTS,
                {
                    params: { classId },
                }
            );
            setSubjects(response.data.data);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            setError("Unable to load subjects. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchSubjects();
    }, [classId]);

    const handleSubjectPress = (subjectId: string, subjectName: string) => {
        router.push({
            pathname: "/chapters",
            params: {
                classId: classId ?? "",
                classNumber: classNumber ?? "",
                subjectId,
                subjectName,
            },
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                    <Text style={styles.loadingText}>Loading subjects...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.errorLight }]}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                    </View>
                    <Text style={styles.errorTitle}>Something went wrong</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={() => void fetchSubjects()}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (subjects.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                        <Text style={styles.emptyIcon}>📭</Text>
                    </View>
                    <Text style={styles.emptyTitle}>No subjects available</Text>
                    <Text style={styles.emptyText}>
                        There are no subjects available for this class yet.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Enhanced Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerIconContainer}>
                        <Text style={styles.headerIcon}>📚</Text>
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Choose a Subject</Text>
                        <Text style={styles.subtitle}>
                            Pick a subject from Class {classNumber} to explore its chapters.
                        </Text>
                    </View>
                </View>
                <View style={styles.headerDivider} />
                <View style={styles.headerMeta}>
                    <View style={styles.classBadge}>
                        <Text style={styles.classBadgeText}>Class {classNumber}</Text>
                    </View>
                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
                        </Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={subjects}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <SubjectCard item={item} index={index} onPress={handleSubjectPress} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
                ListFooterComponent={<View style={{ height: spacing.xxl }} />}
            />
        </View>
    );
}

// Styles – all theme constants remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
    },
    centerContainer: {
        flex: 1,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingIconContainer: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },
    loadingText: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: "500",
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.lg,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },
    errorIcon: {
        fontSize: 32,
    },
    emptyIcon: {
        fontSize: 32,
    },
    errorTitle: {
        ...typography.title,
        color: colors.textPrimary,
        textAlign: "center",
    },
    errorText: {
        marginTop: spacing.sm,
        ...typography.bodySm,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
    },
    retryButton: {
        ...shadows.xl,
        marginTop: spacing.xxl,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: 16,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primary,
    },
    retryButtonText: {
        color: "#FFFFFF",
        ...typography.subtitle,
        fontWeight: "700",
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    emptyTitle: {
        ...typography.title,
        color: colors.textPrimary,
        textAlign: "center",
    },
    emptyText: {
        marginTop: spacing.sm,
        ...typography.bodySm,
        color: colors.textSecondary,
        lineHeight: 22,
        textAlign: "center",
    },

    // Header
    header: {
        marginBottom: spacing.xl,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerIconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    headerIcon: {
        fontSize: 30,
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
        letterSpacing: 0,
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    headerDivider: {
        marginTop: spacing.md,
        height: 2,
        width: 40,
        borderRadius: 2,
        backgroundColor: colors.primary,
        opacity: 0.3,
    },
    headerMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    classBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primaryLight,
    },
    classBadgeText: {
        color: colors.primary,
        ...typography.caption,
        fontWeight: "700",
    },
    countBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.successLight,
    },
    countBadgeText: {
        color: colors.success,
        ...typography.captionSm,
        fontWeight: "700",
    },

    // List
    list: {
        paddingBottom: spacing.xxxl,
    },

    // Cards
    subjectCard: {
        ...shadows.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        borderLeftWidth: 5,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    subjectCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    subjectIcon: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    subjectIconEmoji: {
        fontSize: 24,
    },
    subjectInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    subjectName: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },
    subjectSubtitle: {
        marginTop: spacing.xs,
        ...typography.caption,
        color: colors.primary,
        fontWeight: "600",
    },
    chevronContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    chevron: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: "700",
        marginTop: -2,
        marginLeft: 2,
    },
});