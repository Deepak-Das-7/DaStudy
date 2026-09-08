import {
    ActivityIndicator,
    Linking,
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
    VideoItem,
    VideosResponse,
} from "../../src/types/video";

export default function VideosScreen() {
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

    const [videos, setVideos] = useState<VideoItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchVideos = async (): Promise<void> => {
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
                await api.get<VideosResponse>(
                    "/videos",
                    {
                        params: {
                            chapterId,
                        },
                    }
                );

            setVideos(response.data.data);
        } catch (error) {
            console.error(
                "Failed to fetch videos:",
                error
            );

            setError(
                "Unable to load video lectures. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchVideos();
    }, [chapterId]);

    const openVideo = async (
        youtubeVideoId: string
    ): Promise<void> => {
        const youtubeUrl =
            `https://www.youtube.com/watch?v=${youtubeVideoId}`;

        try {
            await Linking.openURL(youtubeUrl);
        } catch (error) {
            console.error(
                "Failed to open YouTube video:",
                error
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading video lectures...
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
                    style={styles.primaryButton}
                    onPress={() => {
                        void fetchVideos();
                    }}
                >
                    <Text style={styles.primaryButtonText}>
                        Retry
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.secondaryButtonText}>
                        Go Back
                    </Text>
                </Pressable>
            </View>
        );
    }

    if (videos.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>
                    Video lectures not available
                </Text>

                <Text style={styles.emptyText}>
                    Video lectures for this chapter
                    are not available yet.
                </Text>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.secondaryButtonText}>
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

            <View style={styles.videoSection}>
                <Text style={styles.sectionTitle}>
                    Video Lectures
                </Text>

                <Text style={styles.sectionDescription}>
                    Learn this chapter through
                    curated YouTube lectures.
                </Text>

                <View style={styles.videoList}>
                    {videos.map((video) => (
                        <View
                            key={video._id}
                            style={styles.videoCard}
                        >
                            <View style={styles.videoIcon}>
                                <Text style={styles.playIcon}>
                                    ▶
                                </Text>
                            </View>

                            <View style={styles.videoInfo}>
                                <Text style={styles.videoTitle}>
                                    {video.title}
                                </Text>

                                <Text style={styles.channelName}>
                                    {video.channelName}
                                </Text>

                                <Text style={styles.language}>
                                    {video.language.toUpperCase()}
                                </Text>
                            </View>

                            <Pressable
                                style={styles.watchButton}
                                onPress={() => {
                                    void openVideo(
                                        video.youtubeVideoId
                                    );
                                }}
                            >
                                <Text style={styles.watchButtonText}>
                                    Watch
                                </Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
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
        fontSize: 13,
        fontWeight: "600",
    },

    subjectText: {
        marginTop: 4,
        fontSize: 15,
    },

    chapterText: {
        marginTop: 18,
        fontSize: 13,
        fontWeight: "600",
    },

    chapterName: {
        marginTop: 5,
        fontSize: 28,
        lineHeight: 36,
        fontWeight: "700",
    },

    videoSection: {
        paddingTop: 4,
    },

    sectionTitle: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
    },

    sectionDescription: {
        marginTop: 6,
        fontSize: 14,
        lineHeight: 21,
    },

    videoList: {
        marginTop: 18,
        gap: 14,
    },

    videoCard: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
    },

    videoIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
    },

    playIcon: {
        color: "#ffffff",
        fontSize: 16,
        marginLeft: 2,
    },

    videoInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 10,
    },

    videoTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: "600",
    },

    channelName: {
        marginTop: 5,
        fontSize: 13,
    },

    language: {
        marginTop: 4,
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 0.8,
    },

    watchButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#000000",
    },

    watchButtonText: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "600",
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

    primaryButton: {
        marginTop: 24,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: "#000000",
    },

    primaryButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },

    secondaryButton: {
        marginTop: 12,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#dddddd",
    },

    secondaryButtonText: {
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