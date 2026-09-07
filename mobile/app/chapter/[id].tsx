import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { useEffect, useState } from "react";

import { api } from "../../src/services/api";

import type {
    ChapterItem,
    ChapterResponse,
} from "../../src/types/chapter";

import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
} from "../../src/constants/theme";

export default function ChapterDetailsScreen() {
    const {
        id,
        classNumber,
        subjectName,
    } = useLocalSearchParams<{
        id?: string;
        classNumber?: string;
        subjectName?: string;
    }>();

    const [chapter, setChapter] =
        useState<ChapterItem | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchChapter =
        async (): Promise<void> => {
            if (!id) {
                setError(
                    "Chapter information is missing."
                );

                setLoading(false);

                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get<ChapterResponse>(
                        `/chapters/${id}`
                    );

                setChapter(response.data.data);
            } catch (error) {
                console.error(
                    "Failed to fetch chapter:",
                    error
                );

                setError(
                    "Unable to load this chapter. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        void fetchChapter();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>

                    <Text style={styles.loadingText}>
                        Loading chapter...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.errorLight }]}>
                        <Text style={styles.errorIcon}>⚠</Text>
                    </View>

                    <Text style={styles.errorTitle}>
                        Something went wrong
                    </Text>

                    <Text style={styles.errorText}>
                        {error}
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={() => {
                            void fetchChapter();
                        }}
                    >
                        <Text
                            style={styles.retryButtonText}
                        >
                            Retry
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.outlineButtonPressed,
                        ]}
                        onPress={() => router.back()}
                    >
                        <Text
                            style={styles.backButtonText}
                        >
                            Go Back
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (!chapter) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                        <Text style={styles.emptyIcon}>🔍</Text>
                    </View>

                    <Text style={styles.errorTitle}>
                        Chapter not found
                    </Text>

                    <Text style={styles.errorText}>
                        This chapter is no longer available.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.outlineButtonPressed,
                        ]}
                        onPress={() => router.back()}
                    >
                        <Text
                            style={styles.backButtonText}
                        >
                            Go Back
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const subjectBg = getSubjectColor(subjectName || "");

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={
                    styles.contentContainer
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.breadcrumbs}>
                    <View style={styles.crumbBadge}>
                        <Text style={styles.crumbBadgeText}>
                            Class {classNumber}
                        </Text>
                    </View>
                    <Text style={styles.crumbSeparator}>›</Text>
                    <View style={[styles.crumbBadge, { backgroundColor: subjectBg }]}>
                        <Text style={[styles.crumbBadgeText, { color: colors.primary }]}>
                            {subjectName}
                        </Text>
                    </View>
                </View>

                <View style={styles.header}>
                    <View
                        style={[styles.chapterNumberContainer, { backgroundColor: colors.primary }]}
                    >
                        <Text
                            style={styles.chapterNumber}
                        >
                            📖 Chapter {chapter.chapterNumber}
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        {chapter.name}
                    </Text>
                </View>

                <View style={[styles.aboutCallout, { backgroundColor: colors.primaryLight }]}>
                    <View style={styles.aboutIconRow}>
                        <View style={styles.aboutIconBubble}>
                            <Text style={styles.aboutIcon}>💡</Text>
                        </View>
                        <View style={styles.aboutHeaderTexts}>
                            <Text style={styles.aboutLabel}>
                                About this chapter
                            </Text>
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

                <View style={styles.optionsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Start Learning
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            Choose how you want to study
                        </Text>
                    </View>

                    <View style={styles.optionGrid}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.optionCard,
                                styles.optionCardNotes,
                                pressed && styles.optionCardPressed,
                            ]}
                            onPress={() => {
                                console.log(
                                    "Notes selected:",
                                    chapter._id
                                );
                            }}
                        >
                            <View style={[styles.optionIconWrap, { backgroundColor: colors.subjectMath }]}>
                                <Text style={styles.optionEmoji}>📝</Text>
                            </View>

                            <Text style={styles.optionTitle}>
                                Notes
                            </Text>

                            <Text style={styles.optionText}>
                                Detailed explanations and chapter summaries.
                            </Text>

                            <View style={[styles.optionBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.optionBadgeText}>Read →</Text>
                            </View>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.optionCard,
                                styles.optionCardVideo,
                                pressed && styles.optionCardPressed,
                            ]}
                            onPress={() => {
                                console.log(
                                    "Videos selected:",
                                    chapter._id
                                );
                            }}
                        >
                            <View style={[styles.optionIconWrap, { backgroundColor: colors.subjectScience }]}>
                                <Text style={styles.optionEmoji}>🎬</Text>
                            </View>

                            <Text style={styles.optionTitle}>
                                Video Lectures
                            </Text>

                            <Text style={styles.optionText}>
                                Watch curated video lessons for this chapter.
                            </Text>

                            <View style={[styles.optionBadge, { backgroundColor: colors.success }]}>
                                <Text style={styles.optionBadgeText}>Watch →</Text>
                            </View>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.optionCard,
                                styles.optionCardQuestions,
                                pressed && styles.optionCardPressed,
                            ]}
                            onPress={() => {
                                console.log(
                                    "Questions selected:",
                                    chapter._id
                                );
                            }}
                        >
                            <View style={[styles.optionIconWrap, { backgroundColor: colors.subjectHistory }]}>
                                <Text style={styles.optionEmoji}>❓</Text>
                            </View>

                            <Text style={styles.optionTitle}>
                                Practice Questions
                            </Text>

                            <Text style={styles.optionText}>
                                Test yourself with chapter questions.
                            </Text>

                            <View style={[styles.optionBadge, { backgroundColor: colors.warning }]}>
                                <Text style={[styles.optionBadgeText, { color: colors.textPrimary }]}>Practice →</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.tipBox}>
                    <Text style={styles.tipEmoji}>✨</Text>
                    <View style={styles.tipTextCol}>
                        <Text style={styles.tipTitle}>
                            Pro Tip
                        </Text>
                        <Text style={styles.tipBody}>
                            Read the notes first, then watch the videos, 
                            and finish with practice questions for the 
                            best retention.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },

    container: {
        flex: 1,
    },

    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
    },

    breadcrumbs: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
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

    header: {
        paddingTop: spacing.sm,
        marginBottom: spacing.xxl,
    },

    classText: {
        fontSize: 14,
        fontWeight: "600",
    },

    subjectText: {
        marginTop: 4,
        fontSize: 16,
    },

    chapterNumberContainer: {
        alignSelf: "flex-start",
        paddingHorizontal: spacing.lg,
        paddingVertical: 10,
        borderRadius: borderRadius.pill,
        marginBottom: spacing.lg,
        ...shadows.lg,
    },

    chapterNumber: {
        color: "#FFFFFF",
        ...typography.caption,
        fontWeight: "700",
        letterSpacing: 0.2,
    },

    title: {
        ...typography.h2,
        color: colors.textPrimary,
        lineHeight: 40,
        letterSpacing: -0.5,
    },

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

    section: {
        marginTop: 32,
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
    },

    optionCardNotes: {
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },

    optionCardVideo: {
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },

    optionCardQuestions: {
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
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
