import {
    ActivityIndicator,
    FlatList,
    Pressable,
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

import { api } from "../src/services/api";
import type {
    ChapterItem,
    ChaptersResponse,
} from "../src/types/chapter";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
} from "../src/constants/theme";

export default function ChaptersScreen() {
    const {
        classId,
        classNumber,
        subjectId,
        subjectName,
    } = useLocalSearchParams<{
        classId?: string;
        classNumber?: string;
        subjectId?: string;
        subjectName?: string;
    }>();

    const [chapters, setChapters] = useState<
        ChapterItem[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchChapters =
        async (): Promise<void> => {
            if (!subjectId) {
                setError(
                    "Subject information is missing."
                );

                setLoading(false);

                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get<ChaptersResponse>(
                        "/chapters",
                        {
                            params: {
                                subjectId,
                            },
                        }
                    );

                setChapters(response.data.data);
            } catch (error) {
                console.error(
                    "Failed to fetch chapters:",
                    error
                );

                setError(
                    "Unable to load chapters. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        void fetchChapters();
    }, [subjectId]);

    const handleChapterPress = (
        chapterId: string
    ) => {
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

    const getChapterEmoji = (index: number): string => {
        const emojis = ["📘", "📗", "📕", "📙", "📓", "📔", "📒", "📚", "📖", "🗂️"];
        return emojis[index % emojis.length];
    };

    const renderChapter = ({
        item,
        index,
    }: {
        item: ChapterItem;
        index: number;
    }) => {
        const subjectBg = getSubjectColor(subjectName || "");
        const emoji = getChapterEmoji(index);

        return (
            <Pressable
                style={({ pressed }) => [
                    styles.chapterCard,
                    pressed && styles.chapterCardPressed,
                ]}
                onPress={() =>
                    handleChapterPress(item._id)
                }
            >
                <View style={styles.chapterLeft}>
                    <View style={[styles.chapterNumberContainer, { backgroundColor: subjectBg }]}>
                        <Text style={styles.chapterNumberEmoji}>
                            {emoji}
                        </Text>
                    </View>

                    <View style={styles.chapterBadgeCol}>
                        <View style={styles.chapterNumBadge}>
                            <Text style={styles.chapterNumBadgeText}>
                                Ch. {item.chapterNumber}
                            </Text>
                        </View>
                        <Text style={styles.chapterName}>
                            {item.name}
                        </Text>
                        <Text style={styles.chapterSubtitle}>
                            Open chapter details →
                        </Text>
                    </View>
                </View>

                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>

                    <Text style={styles.loadingText}>
                        Loading chapters...
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
                            void fetchChapters();
                        }}
                    >
                        <Text
                            style={styles.retryButtonText}
                        >
                            Retry
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (chapters.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                        <Text style={styles.emptyIcon}>📭</Text>
                    </View>

                    <Text style={styles.emptyTitle}>
                        No chapters available
                    </Text>

                    <Text style={styles.emptyText}>
                        Chapters for this subject are
                        not available yet.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const subjectBg = getSubjectColor(subjectName || "");

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerBreadcrumbs}>
                        <View style={styles.crumbBadge}>
                            <Text style={styles.crumbBadgeText}>
                                Class {classNumber}
                            </Text>
                        </View>
                        <Text style={styles.crumbSeparator}>›</Text>
                        <View style={[styles.crumbBadge, styles.crumbBadgeActive, { backgroundColor: subjectBg }]}>
                            <Text style={[styles.crumbBadgeText, styles.crumbBadgeActiveText]}>
                                {subjectName}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.title}>
                        All Chapters
                    </Text>

                    <Text style={styles.subtitle}>
                        Select a chapter from {subjectName} to begin your learning journey.
                    </Text>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"} total
                        </Text>
                    </View>
                </View>

                <FlatList
                    data={chapters}
                    keyExtractor={(item) => item._id}
                    renderItem={renderChapter}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
                />
            </View>
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
        paddingHorizontal: spacing.xl,
    },

    header: {
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },

    headerBreadcrumbs: {
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

    crumbBadgeActive: {
        borderWidth: 0,
    },

    crumbBadgeText: {
        ...typography.captionSm,
        color: colors.textSecondary,
        fontWeight: "600",
    },

    crumbBadgeActiveText: {
        color: colors.primary,
    },

    crumbSeparator: {
        fontSize: 18,
        color: colors.textMuted,
        marginHorizontal: spacing.sm,
        marginTop: -2,
    },

    classTitle: {
        fontSize: 14,
        fontWeight: "600",
    },

    title: {
        ...typography.h2,
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },

    subtitle: {
        marginTop: spacing.sm,
        ...typography.body,
        color: colors.textSecondary,
    },

    countBadge: {
        alignSelf: "flex-start",
        marginTop: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight,
    },

    countBadgeText: {
        color: colors.primary,
        ...typography.captionSm,
        fontWeight: "700",
    },

    list: {
        paddingBottom: spacing.xxl,
    },

    chapterCard: {
        ...shadows.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    chapterCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
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
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: spacing.md,
    },

    chevron: {
        fontSize: 22,
        color: colors.primary,
        fontWeight: "700",
        marginTop: -2,
        marginLeft: 2,
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
