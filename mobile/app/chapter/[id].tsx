import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

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
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading chapter...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorTitle}>
                    Something went wrong
                </Text>

                <Text style={styles.errorText}>
                    {error}
                </Text>

                <Pressable
                    style={styles.retryButton}
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
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text
                        style={styles.backButtonText}
                    >
                        Go Back
                    </Text>
                </Pressable>
            </View>
        );
    }

    if (!chapter) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorTitle}>
                    Chapter not found
                </Text>

                <Text style={styles.errorText}>
                    This chapter is no longer available.
                </Text>

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text
                        style={styles.backButtonText}
                    >
                        Go Back
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.classText}>
                    Class {classNumber}
                </Text>

                <Text style={styles.subjectText}>
                    {subjectName}
                </Text>

                <View
                    style={styles.chapterNumberContainer}
                >
                    <Text
                        style={styles.chapterNumber}
                    >
                        Chapter {chapter.chapterNumber}
                    </Text>
                </View>

                <Text style={styles.title}>
                    {chapter.name}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Learn This Chapter
                </Text>

                <Text style={styles.sectionText}>
                    Study notes, video lectures, and
                    practice questions for this chapter
                    will be available here.
                </Text>
            </View>

            <View style={styles.options}>
                <Pressable
                    style={styles.optionCard}
                    onPress={() => {
                        console.log(
                            "Notes selected:",
                            chapter._id
                        );
                    }}
                >
                    <Text style={styles.optionTitle}>
                        Notes
                    </Text>

                    <Text style={styles.optionText}>
                        Read chapter notes and explanations.
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.optionCard}
                    onPress={() => {
                        console.log(
                            "Videos selected:",
                            chapter._id
                        );
                    }}
                >
                    <Text style={styles.optionTitle}>
                        Video Lectures
                    </Text>

                    <Text style={styles.optionText}>
                        Watch curated lectures for this
                        chapter.
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.optionCard}
                    onPress={() => {
                        console.log(
                            "Questions selected:",
                            chapter._id
                        );
                    }}
                >
                    <Text style={styles.optionTitle}>
                        Practice Questions
                    </Text>

                    <Text style={styles.optionText}>
                        Practice questions and test your
                        understanding.
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        paddingTop: 8,
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
        marginTop: 20,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        backgroundColor: "#000000",
    },

    chapterNumber: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "600",
    },

    title: {
        marginTop: 14,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "700",
    },

    section: {
        marginTop: 32,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    sectionText: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 23,
    },

    options: {
        marginTop: 24,
    },

    optionCard: {
        marginBottom: 12,
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
    },

    optionTitle: {
        fontSize: 17,
        fontWeight: "600",
    },

    optionText: {
        marginTop: 6,
        fontSize: 14,
        lineHeight: 21,
    },

    centerContainer: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
    },

    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },

    errorText: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },

    retryButton: {
        marginTop: 24,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: "#000000",
    },

    retryButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },

    backButton: {
        marginTop: 12,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#dddddd",
    },

    backButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },
});