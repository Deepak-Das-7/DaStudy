import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { api } from "../src/services/api";
import type {
    SubjectItem,
    SubjectsResponse,
} from "../src/types/subject";

export default function SubjectsScreen() {
    const { classId, classNumber } =
        useLocalSearchParams<{
            classId?: string;
            classNumber?: string;
        }>();

    const [subjects, setSubjects] = useState<
        SubjectItem[]
    >([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchSubjects = async (): Promise<void> => {
        if (!classId) {
            setError("Class information is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await api.get<SubjectsResponse>(
                    "/subjects",
                    {
                        params: {
                            classId,
                        },
                    }
                );

            setSubjects(response.data.data);
        } catch (error) {
            console.error(
                "Failed to fetch subjects:",
                error
            );

            setError(
                "Unable to load subjects. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchSubjects();
    }, [classId]);

    const handleSubjectPress = (
        subjectId: string,
        subjectName: string
    ) => {
        router.push({
            pathname: "/chapters",
            params: {
                classId: classId ?? "",
                classNumber: classNumber ?? "",
                subjectId,
                subjectName,
            },
        });
    };

    const renderSubject = ({
        item,
    }: {
        item: SubjectItem;
    }) => {
        return (
            <Pressable
                style={styles.subjectCard}
                onPress={() =>
                    handleSubjectPress(item._id, item.name)
                }
            >
                <View style={styles.subjectIcon}>
                    <Text style={styles.subjectIconText}>
                        {item.name.charAt(0)}
                    </Text>
                </View>

                <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>
                        {item.name}
                    </Text>

                    <Text style={styles.subjectSubtitle}>
                        View chapters
                    </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading subjects...
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
                        void fetchSubjects();
                    }}
                >
                    <Text style={styles.retryButtonText}>
                        Retry
                    </Text>
                </Pressable>
            </View>
        );
    }

    if (subjects.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>
                    No subjects available
                </Text>

                <Text style={styles.emptyText}>
                    There are no subjects available for
                    this class yet.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Class {classNumber}
                </Text>

                <Text style={styles.subtitle}>
                    Choose a subject to continue learning.
                </Text>
            </View>

            <FlatList
                data={subjects}
                keyExtractor={(item) => item._id}
                renderItem={renderSubject}
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

    centerContainer: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    header: {
        paddingTop: 24,
        paddingBottom: 20,
    },

    title: {
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

    subjectCard: {
        minHeight: 72,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    subjectIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    subjectIconText: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "700",
    },

    subjectInfo: {
        flex: 1,
        marginLeft: 14,
    },

    subjectName: {
        fontSize: 17,
        fontWeight: "600",
    },

    subjectSubtitle: {
        marginTop: 3,
        fontSize: 13,
    },

    arrow: {
        fontSize: 28,
        marginLeft: 8,
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
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
    },

    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
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
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
    },
});