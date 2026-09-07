import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
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

    const renderChapter = ({
        item,
    }: {
        item: ChapterItem;
    }) => {
        return (
            <Pressable
                style={styles.chapterCard}
                onPress={() =>
                    handleChapterPress(item._id)
                }
            >
                <View
                    style={styles.chapterNumberContainer}
                >
                    <Text
                        style={styles.chapterNumber}
                    >
                        {item.chapterNumber}
                    </Text>
                </View>

                <View style={styles.chapterInfo}>
                    <Text
                        style={styles.chapterName}
                    >
                        {item.name}
                    </Text>

                    <Text
                        style={styles.chapterSubtitle}
                    >
                        Open chapter
                    </Text>
                </View>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading chapters...
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
        );
    }

    if (chapters.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>
                    No chapters available
                </Text>

                <Text style={styles.emptyText}>
                    Chapters for this subject are
                    not available yet.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.classTitle}>
                    Class {classNumber}
                </Text>

                <Text style={styles.title}>
                    {subjectName}
                </Text>

                <Text style={styles.subtitle}>
                    Choose a chapter to continue
                    learning.
                </Text>
            </View>

            <FlatList
                data={chapters}
                keyExtractor={(item) => item._id}
                renderItem={renderChapter}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    header: {
        paddingTop: 24,
        paddingBottom: 20,
    },

    classTitle: {
        fontSize: 14,
        fontWeight: "600",
    },

    title: {
        marginTop: 4,
        fontSize: 28,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },

    list: {
        paddingBottom: 24,
    },

    chapterCard: {
        minHeight: 76,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    chapterNumberContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    chapterNumber: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

    chapterInfo: {
        flex: 1,
        marginLeft: 14,
    },

    chapterName: {
        fontSize: 16,
        fontWeight: "600",
    },

    chapterSubtitle: {
        marginTop: 4,
        fontSize: 13,
    },

    arrow: {
        fontSize: 28,
        marginLeft: 8,
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