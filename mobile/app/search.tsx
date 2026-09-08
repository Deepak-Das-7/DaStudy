import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";

import { api } from "../src/services/api";
import type { SearchData, SearchResponse } from "../src/types/search";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getSubjectColor,
    getClassColor,
} from "../src/constants/theme";

// Generic ResultCard with entrance animation
const ResultCard = ({
    title,
    subtitle,
    onPress,
    index,
    type,
}: {
    title: string;
    subtitle: string;
    onPress: () => void;
    index: number;
    type: "class" | "subject" | "chapter" | "note" | "video" | "question";
}) => {
    const delay = index * 60 + 200; // starts after a small delay
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 350,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    // Get accent color based on type
    const getAccentColor = () => {
        switch (type) {
            case "class":
                return colors.primary;
            case "subject":
                return colors.subjectScience;
            case "chapter":
                return colors.subjectMath;
            case "note":
                return colors.warning;
            case "video":
                return colors.success;
            case "question":
                return colors.error;
            default:
                return colors.primary;
        }
    };

    const accentColor = getAccentColor();

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
            }}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.resultCard,
                    { borderLeftColor: accentColor },
                    pressed && styles.cardPressed,
                ]}
                onPress={onPress}
            >
                <View style={styles.resultContent}>
                    <Text style={styles.resultTitle} numberOfLines={2}>
                        {title}
                    </Text>
                    <Text style={styles.resultMeta}>{subtitle}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: accentColor + "20" }]}>
                    <Text style={[styles.typeBadgeText, { color: accentColor }]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default function SearchScreen() {
    const params = useLocalSearchParams<{ q?: string }>();
    const [query, setQuery] = useState(params.q ?? "");
    const [results, setResults] = useState<SearchData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Animation for the whole content
    const containerFade = useRef(new Animated.Value(0)).current;
    const containerTranslate = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(containerFade, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(containerTranslate, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const search = async (): Promise<void> => {
        const trimmedQuery = query.trim();
        if (trimmedQuery.length < 2) {
            setResults(null);
            setError("Enter at least 2 characters to search.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await api.get<SearchResponse>("/search", {
                params: { q: trimmedQuery },
            });
            setResults(response.data.data);
        } catch (requestError) {
            console.error("Search request failed:", requestError);
            setResults(null);
            setError("Unable to search right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.q) {
            search();
        }
    }, []);

    const totalResults =
        (results?.classes.length ?? 0) +
        (results?.subjects.length ?? 0) +
        (results?.chapters.length ?? 0) +
        (results?.notes.length ?? 0) +
        (results?.videos.length ?? 0) +
        (results?.questions.length ?? 0);

    const hasResults = totalResults > 0;

    const openChapter = (chapterId: string): void => {
        router.push({ pathname: `/chapter/${chapterId}` });
    };

    const openClasses = (): void => {
        router.push("/classes");
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Animated.View
                style={{
                    opacity: containerFade,
                    transform: [{ translateY: containerTranslate }],
                }}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search classes, chapters, notes..."
                            style={styles.input}
                            returnKeyType="search"
                            onSubmitEditing={search}
                            placeholderTextColor={colors.textMuted}
                        />
                        {query.length > 0 && (
                            <Pressable onPress={() => setQuery("")} style={styles.clearButton}>
                                <Text style={styles.clearIcon}>✕</Text>
                            </Pressable>
                        )}
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.searchButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={search}
                    >
                        <Text style={styles.searchButtonText}>Search</Text>
                    </Pressable>
                </View>

                {/* Loading */}
                {loading && (
                    <View style={styles.centerState}>
                        <View style={styles.loadingIconContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                        <Text style={styles.stateText}>Searching...</Text>
                    </View>
                )}

                {/* Error */}
                {!loading && error !== "" && (
                    <View style={styles.centerState}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.errorLight }]}>
                            <Text style={styles.errorIcon}>⚠️</Text>
                        </View>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* No Results */}
                {!loading && error === "" && results && !hasResults && (
                    <View style={styles.centerState}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.warningLight }]}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                        </View>
                        <Text style={styles.emptyTitle}>No results found</Text>
                        <Text style={styles.stateText}>Try another keyword.</Text>
                    </View>
                )}

                {/* Results */}
                {!loading && error === "" && results && hasResults && (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultCountContainer}>
                            <Text style={styles.resultCount}>
                                {totalResults} result{totalResults === 1 ? "" : "s"} found
                            </Text>
                            <View style={styles.resultCountBadge} />
                        </View>

                        {results.classes.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Classes</Text>
                                {results.classes.map((item, idx) => (
                                    <ResultCard
                                        key={item._id}
                                        title={item.name}
                                        subtitle={`Class ${item.classNumber}`}
                                        onPress={openClasses}
                                        index={idx}
                                        type="class"
                                    />
                                ))}
                            </View>
                        )}

                        {results.subjects.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Subjects</Text>
                                {results.subjects.map((item, idx) => (
                                    <ResultCard
                                        key={item._id}
                                        title={item.name}
                                        subtitle={item.classId.name}
                                        onPress={openClasses}
                                        index={idx}
                                        type="subject"
                                    />
                                ))}
                            </View>
                        )}

                        {results.chapters.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Chapters</Text>
                                {results.chapters.map((item, idx) => (
                                    <ResultCard
                                        key={item._id}
                                        title={item.name}
                                        subtitle={`Chapter ${item.chapterNumber}`}
                                        onPress={() => openChapter(item._id)}
                                        index={idx}
                                        type="chapter"
                                    />
                                ))}
                            </View>
                        )}

                        {results.notes.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Notes</Text>
                                {results.notes.map((item, idx) => (
                                    <ResultCard
                                        key={item._id}
                                        title={item.title}
                                        subtitle={item.chapterId.name}
                                        onPress={() => openChapter(item.chapterId._id)}
                                        index={idx}
                                        type="note"
                                    />
                                ))}
                            </View>
                        )}

                        {results.videos.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Video Lectures</Text>
                                {results.videos.map((item, idx) => (
                                    <ResultCard
                                        key={item._id}
                                        title={item.title}
                                        subtitle={item.channelName}
                                        onPress={() => openChapter(item.chapterId._id)}
                                        index={idx}
                                        type="video"
                                    />
                                ))}
                            </View>
                        )}

                        {results.questions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Practice Questions</Text>
                                {results.questions.map((item, idx) => (
                                    <ResultCard
                                        key={item._id}
                                        title={item.question}
                                        subtitle={item.chapterId.name}
                                        onPress={() => openChapter(item.chapterId._id)}
                                        index={idx}
                                        type="question"
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxxl,
        backgroundColor: colors.background,
    },
    searchContainer: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    searchInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        ...shadows.sm,
    },
    searchIcon: {
        fontSize: 18,
        color: colors.textMuted,
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.textPrimary,
        paddingVertical: spacing.md,
    },
    clearButton: {
        padding: spacing.sm,
    },
    clearIcon: {
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: "600",
    },
    searchButton: {
        ...shadows.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    searchButtonText: {
        ...typography.subtitle,
        color: "#FFFFFF",
        fontWeight: "700",
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    centerState: {
        paddingVertical: spacing.xxxl,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingIconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.lg,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.md,
    },
    errorIcon: {
        fontSize: 28,
    },
    emptyIcon: {
        fontSize: 28,
    },
    stateText: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginTop: spacing.sm,
        textAlign: "center",
    },
    errorText: {
        ...typography.bodySm,
        color: colors.error,
        textAlign: "center",
        lineHeight: 22,
        maxWidth: "80%",
    },
    emptyTitle: {
        ...typography.title,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    resultsContainer: {
        marginTop: spacing.md,
    },
    resultCountContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    resultCount: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    resultCountBadge: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.md,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        letterSpacing: -0.3,
    },
    resultCard: {
        ...shadows.sm,
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    resultContent: {
        flex: 1,
        marginRight: spacing.md,
    },
    resultTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },
    resultMeta: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    typeBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primaryLight,
    },
    typeBadgeText: {
        ...typography.overline,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});