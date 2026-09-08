import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";

import { api } from "../src/services/api";
import type { ChapterItem, ChaptersResponse } from "../src/types/chapter";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
} from "../src/constants/theme";
import { API_ENDPOINTS } from "../src/constants/api";

// Extracted ChapterCard component with its own animation
const ChapterCard = ({
    item,
    index,
    subjectName,
    onPress,
}: {
    item: ChapterItem;
    index: number;
    subjectName?: string;
    onPress: (chapterId: string) => void;
}) => {
    const subjectBg = getSubjectColor(subjectName || "");
    const emoji = getChapterEmoji(index);
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
                    styles.chapterCard,
                    { borderLeftColor: subjectBg },
                    pressed && styles.chapterCardPressed,
                ]}
                onPress={() => onPress(item._id)}
            >
                <View style={styles.chapterLeft}>
                    <View style={[styles.chapterNumberContainer, { backgroundColor: subjectBg }]}>
                        <Text style={styles.chapterNumberEmoji}>{emoji}</Text>
                    </View>

                    <View style={styles.chapterBadgeCol}>
                        <View style={styles.chapterNumBadge}>
                            <Text style={styles.chapterNumBadgeText}>
                                Ch. {item.chapterNumber}
                            </Text>
                        </View>
                        <Text style={styles.chapterName}>{item.name}</Text>
                        <Text style={styles.chapterSubtitle}>Open chapter details →</Text>
                    </View>
                </View>

                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

// Helper function for emoji mapping
const getChapterEmoji = (index: number): string => {
    const emojis = ["📘", "📗", "📕", "📙", "📓", "📔", "📒", "📚", "📖", "🗂️"];
    return emojis[index % emojis.length];
};

export default function ChaptersScreen() {
    const { classId, classNumber, subjectId, subjectName } = useLocalSearchParams<{
        classId?: string;
        classNumber?: string;
        subjectId?: string;
        subjectName?: string;
    }>();

    const [chapters, setChapters] = useState<ChapterItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Entrance animation for the whole content
    const contentFade = useRef(new Animated.Value(0)).current;
    const contentTranslate = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(contentFade, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(contentTranslate, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const fetchChapters = async (): Promise<void> => {
        if (!subjectId) {
            setError("Subject information is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await api.get<ChaptersResponse>(
                API_ENDPOINTS.CHAPTERS,
                {
                    params: { subjectId },
                }
            );
            setChapters(response.data.data);
        } catch (error) {
            console.error("Failed to fetch chapters:", error);
            setError("Unable to load chapters. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchChapters();
    }, [subjectId]);

    const handleChapterPress = (chapterId: string) => {
        router.push({
            pathname: "/chapter/[id]",
            params: {
                id: chapterId,
                classId: classId ?? "",
                classNumber: classNumber ?? "",
                subjectId: subjectId ?? "",
                subjectName: subjectName ?? "",
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
                    <Text style={styles.loadingText}>Loading chapters...</Text>
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
                        onPress={() => void fetchChapters()}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (chapters.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                        <Text style={styles.emptyIcon}>📭</Text>
                    </View>
                    <Text style={styles.emptyTitle}>No chapters available</Text>
                    <Text style={styles.emptyText}>
                        Chapters for this subject are not available yet.
                    </Text>
                </View>
            </View>
        );
    }

    const subjectBg = getSubjectColor(subjectName || "");

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    opacity: contentFade,
                    transform: [{ translateY: contentTranslate }],
                }}
            >
                {/* Enhanced Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerIconContainer}>
                            <Text style={styles.headerIcon}>📚</Text>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>All Chapters</Text>
                            <Text style={styles.subtitle}>
                                Select a chapter from {subjectName} to begin your learning journey.
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerDivider} />
                    <View style={styles.headerMeta}>
                        <View style={styles.crumbBadge}>
                            <Text style={styles.crumbBadgeText}>Class {classNumber}</Text>
                        </View>
                        <Text style={styles.crumbSeparator}>›</Text>
                        <View style={[styles.crumbBadge, { backgroundColor: subjectBg }]}>
                            <Text style={[styles.crumbBadgeText, { color: colors.primary }]}>
                                {subjectName}
                            </Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>
                                {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
                            </Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    data={chapters}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => (
                        <ChapterCard
                            item={item}
                            index={index}
                            subjectName={subjectName}
                            onPress={handleChapterPress}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
                    ListFooterComponent={<View style={{ height: spacing.xxl }} />}
                />
            </Animated.View>
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
        letterSpacing: -0.5,
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
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    crumbBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    crumbBadgeText: {
        ...typography.captionSm,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    crumbSeparator: {
        fontSize: 18,
        color: colors.textMuted,
        marginHorizontal: spacing.xs,
        marginTop: -2,
    },
    countBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight,
    },
    countBadgeText: {
        color: colors.primary,
        ...typography.captionSm,
        fontWeight: "700",
    },

    // List
    list: {
        paddingBottom: spacing.xxxl,
    },

    // Cards
    chapterCard: {
        ...shadows.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftWidth: 5,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    chapterCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    chapterLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    chapterNumberContainer: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    chapterNumberEmoji: {
        fontSize: 24,
    },
    chapterBadgeCol: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    chapterNumBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight,
        marginBottom: spacing.xs,
    },
    chapterNumBadgeText: {
        color: colors.primary,
        ...typography.overline,
        fontWeight: "700",
    },
    chapterName: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },
    chapterSubtitle: {
        marginTop: 3,
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
        marginLeft: spacing.md,
    },
    chevron: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: "700",
        marginTop: -2,
        marginLeft: 2,
    },

    // Loading/Error states (unchanged)
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
    loadingText: {
        marginTop: spacing.md,
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: "500",
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
        lineHeight: 22,
        textAlign: "center",
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
});