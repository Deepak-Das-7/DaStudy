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
    QuestionItem,
    QuestionsResponse,
} from "../../src/types/question";

export default function QuestionsScreen() {
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

    const [questions, setQuestions] =
        useState<QuestionItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchQuestions = async (): Promise<void> => {
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
                await api.get<QuestionsResponse>(
                    "/questions",
                    {
                        params: {
                            chapterId,
                        },
                    }
                );

            setQuestions(response.data.data);
        } catch (error) {
            console.error(
                "Failed to fetch questions:",
                error
            );

            setError(
                "Unable to load practice questions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchQuestions();
    }, [chapterId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading questions...
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
                        void fetchQuestions();
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
                    <Text
                        style={styles.secondaryButtonText}
                    >
                        Go Back
                    </Text>
                </Pressable>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>
                    Practice questions not available
                </Text>

                <Text style={styles.emptyText}>
                    Practice questions for this chapter
                    are not available yet.
                </Text>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={() => router.back()}
                >
                    <Text
                        style={styles.secondaryButtonText}
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

                <Text style={styles.questionCount}>
                    {questions.length} practice questions
                </Text>
            </View>

            <View style={styles.questionList}>
                {questions.map(
                    (question, questionIndex) => (
                        <View
                            key={question._id}
                            style={styles.questionCard}
                        >
                            <Text style={styles.questionNumber}>
                                Question {questionIndex + 1}
                            </Text>

                            <Text style={styles.questionText}>
                                {question.question}
                            </Text>

                            <View style={styles.optionsContainer}>
                                {question.options.map(
                                    (option, optionIndex) => (
                                        <Pressable
                                            key={`${question._id}-${optionIndex}`}
                                            style={styles.optionButton}
                                        >
                                            <View
                                                style={styles.optionNumber}
                                            >
                                                <Text
                                                    style={
                                                        styles.optionNumberText
                                                    }
                                                >
                                                    {String.fromCharCode(
                                                        65 + optionIndex
                                                    )}
                                                </Text>
                                            </View>

                                            <Text
                                                style={styles.optionText}
                                            >
                                                {option}
                                            </Text>
                                        </Pressable>
                                    )
                                )}
                            </View>
                        </View>
                    )
                )}
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

    questionCount: {
        marginTop: 10,
        fontSize: 14,
    },

    questionList: {
        gap: 16,
    },

    questionCard: {
        padding: 18,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 14,
    },

    questionNumber: {
        fontSize: 13,
        fontWeight: "600",
    },

    questionText: {
        marginTop: 10,
        fontSize: 18,
        lineHeight: 26,
        fontWeight: "600",
    },

    optionsContainer: {
        marginTop: 18,
        gap: 10,
    },

    optionButton: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    optionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#dddddd",
    },

    optionNumberText: {
        fontSize: 13,
        fontWeight: "600",
    },

    optionText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
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