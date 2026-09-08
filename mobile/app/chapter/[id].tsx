import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";

import { api } from "../../src/services/api";
import type { ChapterItem, ChapterResponse } from "../../src/types/chapter";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
} from "../../src/constants/theme";

// Extracted OptionCard component with its own entrance animation
const OptionCard = ({
    emoji,
    title,
    description,
    badgeText,
    badgeColor,
    borderColor,
    iconBg,
    onPress,
    index,
}: {
    emoji: string;
    title: string;
    description: string;
    badgeText: string;
    badgeColor: string;
    borderColor: string;
    iconBg: string;
    onPress: () => void;
    index: number;
}) => {
    const delay = index * 120;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 500,
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
                    styles.optionCard,
                    { borderLeftColor: borderColor },
                    pressed && styles.optionCardPressed,
                ]}
                onPress={onPress}
            >
                <View style={[styles.optionIconWrap, { backgroundColor: iconBg }]}>
                    <Text style={styles.optionEmoji}>{emoji}</Text>
                </View>

                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionText}>{description}</Text>

                <View style={[styles.optionBadge, { backgroundColor: badgeColor }]}>
                    <Text
                        style={[
                            styles.optionBadgeText,
                            badgeColor === colors.warning && { color: colors.textPrimary },
                        ]}
                    >
                        {badgeText}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default function ChapterDetailsScreen() {
    const { id, classNumber, subjectName } = useLocalSearchParams<{
        id?: string;
        classNumber?: string;
        subjectName?: string;
    }>();

    const [chapter, setChapter] = useState<ChapterItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Animation for whole content (fade + slide up)
    const contentFade = useRef(new Animated.Value(0)).current;
    const contentTranslate = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(contentFade, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(contentTranslate, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const fetchChapter = async (): Promise<void> => {
        if (!id) {
            setError("Chapter information is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await api.get<ChapterResponse>(`/chapters/${id}`);
            setChapter(response.data.data);
        } catch (error) {
            console.error("Failed to fetch chapter:", error);
            setError("Unable to load this chapter. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchChapter();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                    <Text style={styles.loadingText}>Loading chapter...</Text>
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
                        onPress={() => void fetchChapter()}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.outlineButtonPressed,
                        ]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    if (!chapter) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                        <Text style={styles.emptyIcon}>🔍</Text>
                    </View>
                    <Text style={styles.errorTitle}>Chapter not found</Text>
                    <Text style={styles.errorText}>This chapter is no longer available.</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.outlineButtonPressed,
                        ]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    const subjectBg = getSubjectColor(subjectName || "");

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View
                style={{
                    opacity: contentFade,
                    transform: [{ translateY: contentTranslate }],
                }}
            >
                {/* Breadcrumbs */}
                <View style={styles.breadcrumbs}>
                    <View style={styles.crumbBadge}>
                        <Text style={styles.crumbBadgeText}>Class {classNumber}</Text>
                    </View>
                    <Text style={styles.crumbSeparator}>›</Text>
                    <View style={[styles.crumbBadge, { backgroundColor: subjectBg }]}>
                        <Text style={[styles.crumbBadgeText, { color: colors.primary }]}>
                            {subjectName}
                        </Text>
                    </View>
                </View>

                {/* Enhanced Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerIconContainer}>
                            <Text style={styles.headerIcon}>📖</Text>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>{chapter.name}</Text>
                            <Text style={styles.subtitle}>
                                Chapter {chapter.chapterNumber}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerDivider} />
                </View>

                {/* About Callout */}
                <View style={[styles.aboutCallout, { backgroundColor: colors.primaryLight }]}>
                    <View style={styles.aboutIconRow}>
                        <View style={styles.aboutIconBubble}>
                            <Text style={styles.aboutIcon}>💡</Text>
                        </View>
                        <View style={styles.aboutHeaderTexts}>
                            <Text style={styles.aboutLabel}>About this chapter</Text>
                            <Text style={styles.aboutSubLabel}>
                                Everything you need to master this topic
                            </Text>
                        </View>
                    </View>
                    <View style={styles.aboutDivider} />
                    <Text style={styles.aboutDescription}>
                        This chapter covers the core concepts of{" "}
                        <Text style={styles.aboutHighlight}>{chapter.name}</Text>.
                        Work through the detailed notes, watch the curated video
                        lectures, and test your knowledge with the practice
                        questions below to build a solid understanding.
                    </Text>
                </View>

                {/* Options Section */}
                <View style={styles.optionsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Start Learning</Text>
                        <Text style={styles.sectionSubtitle}>
                            Choose how you want to study
                        </Text>
                    </View>

                    <View style={styles.optionGrid}>
                        <OptionCard
                            emoji="📝"
                            title="Notes"
                            description="Detailed explanations and chapter summaries."
                            badgeText="Read →"
                            badgeColor={colors.primary}
                            borderColor={colors.primary}
                            iconBg={colors.subjectMath}
                            onPress={() => {
                                router.push({
                                    pathname: "/chapter/notes",
                                    params: {
                                        chapterId: chapter._id,
                                        chapterNumber:
                                            chapter.chapterNumber.toString(),
                                        chapterName: chapter.name,
                                        classNumber: classNumber ?? "",
                                        subjectName: subjectName ?? "",
                                    },
                                });
                            }}
                            index={0}
                        />
                        <OptionCard
                            emoji="🎬"
                            title="Video Lectures"
                            description="Watch curated video lessons for this chapter."
                            badgeText="Watch →"
                            badgeColor={colors.success}
                            borderColor={colors.success}
                            iconBg={colors.subjectScience}
                            onPress={() => {
                                router.push({
                                    pathname: "/chapter/videos",
                                    params: {
                                        chapterId: chapter._id,
                                        chapterNumber:
                                            chapter.chapterNumber.toString(),
                                        chapterName: chapter.name,
                                        classNumber: classNumber ?? "",
                                        subjectName: subjectName ?? "",
                                    },
                                });
                            }}
                            index={1}
                        />
                        <OptionCard
                            emoji="❓"
                            title="Practice Questions"
                            description="Test yourself with chapter questions."
                            badgeText="Practice →"
                            badgeColor={colors.warning}
                            borderColor={colors.warning}
                            iconBg={colors.subjectHistory}
                            onPress={() => console.log("Questions selected:", chapter._id)}
                            index={2}
                        />
                    </View>
                </View>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                    <Text style={styles.tipEmoji}>✨</Text>
                    <View style={styles.tipTextCol}>
                        <Text style={styles.tipTitle}>Pro Tip</Text>
                        <Text style={styles.tipBody}>
                            Read the notes first, then watch the videos,
                            and finish with practice questions for the
                            best retention.
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
}

// Styles – all theme constants remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xxxl,
    },

    // Breadcrumbs
    breadcrumbs: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.md,
        flexWrap: "wrap",
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
        marginHorizontal: spacing.sm,
        marginTop: -2,
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

    // About
    aboutCallout: {
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        marginBottom: spacing.xxxl,
    },
    aboutIconRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    aboutIconBubble: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.card,
        alignItems: "center",
        justifyContent: "center",
        ...shadows.sm,
    },
    aboutIcon: {
        fontSize: 22,
    },
    aboutHeaderTexts: {
        flex: 1,
        marginLeft: spacing.md,
    },
    aboutLabel: {
        ...typography.subtitle,
        color: colors.primary,
        fontWeight: "800",
    },
    aboutSubLabel: {
        marginTop: 2,
        ...typography.captionSm,
        color: colors.textSecondary,
        fontWeight: "500",
    },
    aboutDivider: {
        height: 1,
        backgroundColor: colors.primaryMuted,
        marginVertical: spacing.md,
    },
    aboutDescription: {
        ...typography.bodySm,
        color: colors.textPrimary,
        lineHeight: 24,
        opacity: 0.9,
    },
    aboutHighlight: {
        color: colors.primary,
        fontWeight: "700",
    },

    // Options
    optionsSection: {
        marginBottom: spacing.xxl,
    },
    sectionHeader: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        letterSpacing: -0.3,
    },
    sectionSubtitle: {
        marginTop: spacing.xs,
        ...typography.bodySm,
        color: colors.textSecondary,
    },
    optionGrid: {
        gap: spacing.lg,
    },
    optionCard: {
        ...shadows.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    optionCardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
    optionIconWrap: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.md,
    },
    optionEmoji: {
        fontSize: 28,
    },
    optionTitle: {
        ...typography.title,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    optionText: {
        ...typography.bodySm,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    optionBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: borderRadius.pill,
    },
    optionBadgeText: {
        color: "#FFFFFF",
        ...typography.caption,
        fontWeight: "700",
    },

    // Tip
    tipBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.warningLight,
    },
    tipEmoji: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    tipTextCol: {
        flex: 1,
    },
    tipTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
        fontWeight: "800",
        marginBottom: 2,
    },
    tipBody: {
        ...typography.bodySm,
        color: colors.textSecondary,
        lineHeight: 22,
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
    backButton: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: 14,
        borderRadius: borderRadius.pill,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.card,
        ...shadows.sm,
    },
    backButtonText: {
        ...typography.subtitle,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    outlineButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
        backgroundColor: colors.background,
    },
});