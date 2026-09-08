import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { useEffect, useState } from "react";

import { api } from "../src/services/api";

import {
    SearchData,
    SearchResponse,
} from "../src/types/search";

export default function SearchScreen() {
    const params =
        useLocalSearchParams<{
            q?: string;
        }>();

    const [query, setQuery] = useState(
        params.q ?? ""
    );

    const [results, setResults] =
        useState<SearchData | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const search = async (): Promise<void> => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setResults(null);
            setError(
                "Enter at least 2 characters to search."
            );

            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await api.get<SearchResponse>(
                    "/search",
                    {
                        params: {
                            q: trimmedQuery,
                        },
                    }
                );

            setResults(response.data.data);
        } catch (requestError) {
            console.error(
                "Search request failed:",
                requestError
            );

            setResults(null);

            setError(
                "Unable to search right now. Please try again."
            );
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

    const hasResults =
        totalResults > 0;

    const openChapter = (
        chapterId: string
    ): void => {
        router.push({
            pathname: `/chapter/${chapterId}`,
        });
    };

    const openClasses = (): void => {
        router.push("/classes");
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.searchContainer}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search classes, chapters, notes..."
                    style={styles.input}
                    returnKeyType="search"
                    onSubmitEditing={search}
                />

                <Pressable
                    style={styles.searchButton}
                    onPress={search}
                >
                    <Text style={styles.searchButtonText}>
                        Search
                    </Text>
                </Pressable>
            </View>

            {loading && (
                <View style={styles.centerState}>
                    <ActivityIndicator size="large" />

                    <Text style={styles.stateText}>
                        Searching...
                    </Text>
                </View>
            )}

            {!loading && error !== "" && (
                <View style={styles.centerState}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            )}

            {!loading &&
                error === "" &&
                results &&
                !hasResults && (
                    <View style={styles.centerState}>
                        <Text style={styles.emptyTitle}>
                            No results found
                        </Text>

                        <Text style={styles.stateText}>
                            Try another keyword.
                        </Text>
                    </View>
                )}

            {!loading &&
                error === "" &&
                results &&
                hasResults && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultCount}>
                            {totalResults} result
                            {totalResults === 1 ? "" : "s"}
                        </Text>

                        {results.classes.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Classes
                                </Text>

                                {results.classes.map((item) => (
                                    <Pressable
                                        key={item._id}
                                        style={styles.resultCard}
                                        onPress={openClasses}
                                    >
                                        <Text style={styles.resultTitle}>
                                            {item.name}
                                        </Text>

                                        <Text style={styles.resultMeta}>
                                            Class {item.classNumber}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {results.subjects.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Subjects
                                </Text>

                                {results.subjects.map((item) => (
                                    <Pressable
                                        key={item._id}
                                        style={styles.resultCard}
                                        onPress={openClasses}
                                    >
                                        <Text style={styles.resultTitle}>
                                            {item.name}
                                        </Text>

                                        <Text style={styles.resultMeta}>
                                            {item.classId.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {results.chapters.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Chapters
                                </Text>

                                {results.chapters.map((item) => (
                                    <Pressable
                                        key={item._id}
                                        style={styles.resultCard}
                                        onPress={() =>
                                            openChapter(item._id)
                                        }
                                    >
                                        <Text style={styles.resultTitle}>
                                            {item.name}
                                        </Text>

                                        <Text style={styles.resultMeta}>
                                            Chapter {item.chapterNumber}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {results.notes.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Notes
                                </Text>

                                {results.notes.map((item) => (
                                    <Pressable
                                        key={item._id}
                                        style={styles.resultCard}
                                        onPress={() =>
                                            openChapter(
                                                item.chapterId._id
                                            )
                                        }
                                    >
                                        <Text style={styles.resultTitle}>
                                            {item.title}
                                        </Text>

                                        <Text style={styles.resultMeta}>
                                            {item.chapterId.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {results.videos.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Video Lectures
                                </Text>

                                {results.videos.map((item) => (
                                    <Pressable
                                        key={item._id}
                                        style={styles.resultCard}
                                        onPress={() =>
                                            openChapter(
                                                item.chapterId._id
                                            )
                                        }
                                    >
                                        <Text style={styles.resultTitle}>
                                            {item.title}
                                        </Text>

                                        <Text style={styles.resultMeta}>
                                            {item.channelName}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {results.questions.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Practice Questions
                                </Text>

                                {results.questions.map((item) => (
                                    <Pressable
                                        key={item._id}
                                        style={styles.resultCard}
                                        onPress={() =>
                                            openChapter(
                                                item.chapterId._id
                                            )
                                        }
                                    >
                                        <Text style={styles.resultTitle}>
                                            {item.question}
                                        </Text>

                                        <Text style={styles.resultMeta}>
                                            {item.chapterId.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>
                )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },

    searchContainer: {
        gap: 10,
    },

    input: {
        minHeight: 50,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 10,
        fontSize: 16,
    },

    searchButton: {
        minHeight: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
    },

    searchButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },

    centerState: {
        paddingVertical: 50,
        alignItems: "center",
    },

    stateText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: "center",
    },

    errorText: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    resultsContainer: {
        marginTop: 28,
    },

    resultCount: {
        fontSize: 14,
        fontWeight: "600",
    },

    section: {
        marginTop: 28,
    },

    sectionTitle: {
        marginBottom: 12,
        fontSize: 20,
        fontWeight: "700",
    },

    resultCard: {
        marginBottom: 10,
        padding: 16,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 12,
        backgroundColor: "#ffffff",
    },

    resultTitle: {
        fontSize: 16,
        lineHeight: 23,
        fontWeight: "600",
    },

    resultMeta: {
        marginTop: 6,
        fontSize: 13,
    },
});