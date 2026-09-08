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
import type { NoteItem, NotesResponse } from "../../src/types/note";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
} from "../../src/constants/theme";
import { API_ENDPOINTS } from "../../src/constants/api";

// Extracted NoteCard component (no animations needed, but can be used for consistency)
const NoteCard = ({ note, index }: { note: NoteItem; index: number }) => {
    const delay = index * 100;
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
            <View style={styles.noteCard}>
                <View style={styles.noteHeader}>
                    <View style={styles.languageBadge}>
                        <Text style={styles.languageBadgeText}>
                            {note.title}, {note.language.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.noteIndex}>#{index + 1}</Text>
                </View>
                <Text style={styles.noteContent}>{note.content}</Text>
            </View>
        </Animated.View>
    );
};

export default function NotesScreen() {
    const {
        chapterId,
        chapterNumber,
        chapterName,
        classNumber,
        subjectName,
    } = useLocalSearchParams<{
        chapterId?: string;
        chapterNumber?: string;
        chapterName?: string;
        classNumber?: string;
        subjectName?: string;
    }>();

    const [notes, setNotes] = useState<NoteItem[]>([]);
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

    const fetchNotes = async (): Promise<void> => {
        if (!chapterId) {
            setError("Chapter information is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await api.get<NotesResponse>(
                API_ENDPOINTS.NOTES,
                {
                    params: { chapterId },
                }
            );
            setNotes(response.data.data);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
            setError("Unable to load notes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchNotes();
    }, [chapterId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.loadingIconContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <Text style={styles.loadingText}>Loading notes...</Text>
            </View>
        );
    }

    if (error) {
        return (
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
                    onPress={() => void fetchNotes()}
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
        );
    }

    if (notes.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                    <Text style={styles.emptyIcon}>📝</Text>
                </View>
                <Text style={styles.emptyTitle}>Notes not available</Text>
                <Text style={styles.emptyText}>
                    Notes for this chapter are not available yet.
                </Text>
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
                {/* Enhanced Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerIconContainer}>
                            <Text style={styles.headerIcon}>📝</Text>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>{chapterName || "Chapter Notes"}</Text>
                            <Text style={styles.subtitle}>
                                Chapter {chapterNumber} • {subjectName}
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
                                {notes.length} {notes.length === 1 ? "note" : "notes"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes List */}
                <View style={styles.notesContainer}>
                    {notes.map((note, index) => (
                        <NoteCard key={note._id} note={note} index={index} />
                    ))}
                </View>
            </Animated.View>
        </ScrollView>
    );
}

// All styles now use the theme constants
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxxl,
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

    // Notes
    notesContainer: {
        gap: spacing.lg,
    },
    noteCard: {
        ...shadows.sm,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    noteHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    languageBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primaryLight,
    },
    languageBadgeText: {
        ...typography.overline,
        color: colors.primary,
        fontWeight: "700",
    },
    noteIndex: {
        ...typography.captionSm,
        color: colors.textMuted,
        fontWeight: "500",
    },
    noteContent: {
        ...typography.body,
        color: colors.textPrimary,
        lineHeight: 26,
        opacity: 0.95,
    },

    // Loading/Error/Empty states
    centerContainer: {
        flex: 1,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
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
        marginTop: spacing.md,
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