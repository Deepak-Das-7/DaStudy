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
    NoteItem,
    NotesResponse,
} from "../../src/types/note";

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

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchNotes = async (): Promise<void> => {
        if (!chapterId) {
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
                await api.get<NotesResponse>(
                    "/notes",
                    {
                        params: {
                            chapterId,
                        },
                    }
                );

            setNotes(response.data.data);
        } catch (error) {
            console.error(
                "Failed to fetch notes:",
                error
            );

            setError(
                "Unable to load notes. Please try again."
            );
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
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading notes...
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
                        void fetchNotes();
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

    if (notes.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>
                    Notes not available
                </Text>

                <Text style={styles.emptyText}>
                    Notes for this chapter are not
                    available yet.
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

                <Text style={styles.chapterText}>
                    Chapter {chapterNumber}
                </Text>

                <Text style={styles.chapterName}>
                    {chapterName}
                </Text>
            </View>

            <View style={styles.notesContainer}>
                {notes.map((note) => (
                    <View
                        key={note._id}
                        style={styles.noteCard}
                    >
                        <Text style={styles.noteTitle}>
                            {note.title}
                        </Text>

                        <Text style={styles.noteContent}>
                            {note.content}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },

    header: {
        paddingTop: 24,
        paddingBottom: 24,
    },

    classText: {
        fontSize: 14,
        fontWeight: "600",
    },

    subjectText: {
        marginTop: 4,
        fontSize: 15,
    },

    chapterText: {
        marginTop: 16,
        fontSize: 14,
        fontWeight: "600",
    },

    chapterName: {
        marginTop: 4,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "700",
    },

    notesContainer: {
        gap: 16,
    },

    noteCard: {
        padding: 18,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 12,
    },

    noteTitle: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: "700",
    },

    noteContent: {
        marginTop: 12,
        fontSize: 16,
        lineHeight: 26,
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

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },

    emptyText: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },
});