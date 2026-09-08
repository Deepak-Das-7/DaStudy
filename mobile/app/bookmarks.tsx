import { useCallback, useState, useRef, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Animated, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { BookmarkItem } from "../src/types/bookmark";
import { getBookmarks, removeBookmark } from "../src/services/bookmarkStorage";
import {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
} from "../src/constants/theme";

// Extracted BookmarkCard component with entrance animation
const BookmarkCard = ({
    item,
    index,
    onRemove,
    onOpen,
}: {
    item: BookmarkItem;
    index: number;
    onRemove: (id: string) => void;
    onOpen: (item: BookmarkItem) => void;
}) => {
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

    const getTypeColor = () => {
        switch (item.type) {
            case "chapter": return colors.primary;
            case "note": return colors.warning;
            case "video": return colors.success;
            default: return colors.textMuted;
        }
    };

    const typeColor = getTypeColor();

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
            }}
        >
            <View style={[styles.card, { borderLeftColor: typeColor }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.cardContent,
                        pressed && styles.cardPressed,
                    ]}
                    onPress={() => onOpen(item)}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.typeBadge, { backgroundColor: typeColor + "20" }]}>
                            <Text style={[styles.typeText, { color: typeColor }]}>
                                {item.type.toUpperCase()}
                            </Text>
                        </View>
                        <Pressable
                            style={({ pressed }) => [
                                styles.removeButton,
                                pressed && styles.removePressed,
                            ]}
                            onPress={() => onRemove(item.id)}
                        >
                            <Text style={styles.removeIcon}>✕</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.title}
                    </Text>

                    {item.subtitle && (
                        <Text style={styles.subtitleText} numberOfLines={1}>
                            {item.subtitle}
                        </Text>
                    )}
                </Pressable>
            </View>
        </Animated.View>
    );
};

export default function BookmarksScreen() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Animation for the whole screen
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

    const loadBookmarks = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await getBookmarks();
            setBookmarks(data);
        } catch (error) {
            console.error("Failed to load bookmarks:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookmarks();
        }, [loadBookmarks])
    );

    const handleRemoveBookmark = async (id: string): Promise<void> => {
        await removeBookmark(id);
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    };

    const handleOpenBookmark = (bookmark: BookmarkItem): void => {
        if (!bookmark.chapterId) return;
        router.push({ pathname: `/chapter/${bookmark.chapterId}` });
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <View style={styles.loadingIconContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <Text style={styles.loadingText}>Loading bookmarks...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: contentFade,
                        transform: [{ translateY: contentTranslate }],
                    },
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerIconContainer}>
                            <Text style={styles.headerIcon}>⭐</Text>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>My Bookmarks</Text>
                            <Text style={styles.subtitle}>
                                {bookmarks.length} saved {bookmarks.length === 1 ? "item" : "items"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerDivider} />
                </View>

                {/* Empty State or List */}
                {bookmarks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                            <Text style={styles.emptyIcon}>📭</Text>
                        </View>
                        <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                        <Text style={styles.emptyText}>
                            Bookmark chapters you want to quickly access later.
                        </Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.primaryButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={() => router.push("/classes")}
                        >
                            <Text style={styles.primaryButtonText}>Browse Classes →</Text>
                        </Pressable>
                    </View>
                ) : (
                    <FlatList
                        data={bookmarks}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <BookmarkCard
                                item={item}
                                index={index}
                                onRemove={handleRemoveBookmark}
                                onOpen={handleOpenBookmark}
                            />
                        )}
                    />
                )}
            </Animated.View>
        </View>
    );
}

// All styles now use theme constants
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
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
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: "500",
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerIconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.warningLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    headerIcon: {
        fontSize: 24,
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
    listContent: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.xxxl,
        gap: spacing.md,
    },
    card: {
        ...shadows.sm,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    cardContent: {
        padding: spacing.lg,
    },
    cardPressed: {
        opacity: 0.85,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    typeBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primaryLight,
    },
    typeText: {
        ...typography.overline,
        color: colors.primary,
        fontWeight: "700",
    },
    removeButton: {
        padding: spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.errorLight,
    },
    removePressed: {
        opacity: 0.7,
        transform: [{ scale: 0.9 }],
    },
    removeIcon: {
        fontSize: 14,
        color: colors.error,
        fontWeight: "700",
    },
    cardTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
        marginTop: spacing.xs,
    },
    subtitleText: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },
    emptyIcon: {
        fontSize: 36,
    },
    emptyTitle: {
        ...typography.title,
        color: colors.textPrimary,
        textAlign: "center",
    },
    emptyText: {
        ...typography.bodySm,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: spacing.sm,
        lineHeight: 22,
    },
    primaryButton: {
        ...shadows.md,
        marginTop: spacing.xxl,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: 16,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primary,
    },
    primaryButtonText: {
        ...typography.subtitle,
        color: "#FFFFFF",
        fontWeight: "700",
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});