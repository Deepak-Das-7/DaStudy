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
import { API_ENDPOINTS } from "../../src/constants/api";
import { borderRadius, colors, shadows, spacing, typography } from "../../src/constants/theme";

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
                    API_ENDPOINTS.VIDEOS,
                    {
                        params: { chapterId },
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
        backgroundColor: colors.background,
    },

    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
    },

    header: {
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },

    classText: {
        ...typography.overline,
        color: colors.primary,
    },

    subjectText: {
        marginTop: spacing.xs,
        ...typography.bodySm,
        color: colors.textSecondary,
    },

    chapterText: {
        marginTop: spacing.lg,
        ...typography.overline,
        color: colors.textSecondary,
    },

    chapterName: {
        marginTop: spacing.xs,
        ...typography.h2,
        color: colors.textPrimary,
    },

    videoSection: {
        paddingTop: 4,
    },

    sectionTitle: {
        ...typography.title,
        color: colors.textPrimary,
    },

    sectionDescription: {
        marginTop: spacing.xs,
        ...typography.caption,
        color: colors.textSecondary,
    },

    videoList: {
        marginTop: spacing.lg,
        gap: spacing.md,
    },

    videoCard: {
        ...shadows.sm,
        padding: spacing.md,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        flexDirection: "row",
        alignItems: "center",
    },

    videoIcon: {
        width: 42,
        height: 42,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
    },

    playIcon: {
        color: colors.card,
        fontSize: 16,
        marginLeft: 2,
    },

    videoInfo: {
        flex: 1,
        marginLeft: spacing.md,
        marginRight: spacing.sm,
    },

    videoTitle: {
        ...typography.bodySm,
        color: colors.textPrimary,
        fontWeight: "700",
    },

    channelName: {
        marginTop: spacing.xs,
        ...typography.captionSm,
        color: colors.textSecondary,
    },

    language: {
        marginTop: spacing.xs,
        ...typography.overline,
        color: colors.primary,
    },

    watchButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primary,
    },

    watchButtonText: {
        color: colors.card,
        ...typography.captionSm,
        fontWeight: "700",
    },

    centerContainer: {
        flex: 1,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: spacing.md,
        ...typography.bodySm,
        color: colors.textSecondary,
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
        textAlign: "center",
    },

    primaryButton: {
        marginTop: spacing.xxl,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
    },

    primaryButtonText: {
        color: colors.card,
        ...typography.caption,
        fontWeight: "700",
    },

    secondaryButton: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },

    secondaryButtonText: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: "700",
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