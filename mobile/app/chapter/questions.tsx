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
import { API_ENDPOINTS } from "../../src/constants/api";
import { borderRadius, colors, spacing, typography } from "../../src/constants/theme";

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

    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState<number | null>(null);

    const [submitted, setSubmitted] =
        useState(false);

    const [score, setScore] =
        useState(0);

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
                    API_ENDPOINTS.QUESTIONS,
                    {
                        params: { chapterId },
                    }
                );

            setQuestions(response.data.data);

            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
            setSubmitted(false);
            setScore(0);
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

    const currentQuestion =
        questions[currentQuestionIndex];

    const isLastQuestion =
        currentQuestionIndex ===
        questions.length - 1;

    const handleSelectAnswer = (
        optionIndex: number
    ): void => {
        if (submitted) {
            return;
        }

        setSelectedAnswer(optionIndex);
    };

    const handleCheckAnswer = (): void => {
        if (
            selectedAnswer === null ||
            submitted ||
            !currentQuestion
        ) {
            return;
        }

        setSubmitted(true);

        if (
            selectedAnswer ===
            currentQuestion.correctAnswer
        ) {
            setScore((previousScore) => previousScore + 1);
        }
    };
    const handleFinishQuiz = (): void => {
        const finalScore =
            score +
            (selectedAnswer ===
                currentQuestion.correctAnswer
                ? 1
                : 0);

        router.replace({
            pathname: "/chapter/quiz-result",
            params: {
                score: finalScore.toString(),
                total: questions.length.toString(),
                chapterId:
                    chapterId ?? "",
                chapterNumber:
                    chapterNumber ?? "",
                chapterName:
                    chapterName ?? "",
                classNumber:
                    classNumber ?? "",
                subjectName:
                    subjectName ?? "",
            },
        });
    };
    const handleNextQuestion = (): void => {
        if (isLastQuestion) {
            return;
        }

        setCurrentQuestionIndex(
            (previousIndex) =>
                previousIndex + 1
        );

        setSelectedAnswer(null);
        setSubmitted(false);
    };

    const getOptionStyle = (
        optionIndex: number
    ) => {
        if (!submitted) {
            if (
                selectedAnswer === optionIndex
            ) {
                return styles.selectedOption;
            }

            return styles.optionButton;
        }

        if (
            currentQuestion.correctAnswer ===
            optionIndex
        ) {
            return styles.correctOption;
        }

        if (
            selectedAnswer === optionIndex &&
            selectedAnswer !==
            currentQuestion.correctAnswer
        ) {
            return styles.incorrectOption;
        }

        return styles.optionButton;
    };

    const getOptionNumberStyle = (
        optionIndex: number
    ) => {
        if (!submitted) {
            if (
                selectedAnswer === optionIndex
            ) {
                return styles.selectedOptionNumber;
            }

            return styles.optionNumber;
        }

        if (
            currentQuestion.correctAnswer ===
            optionIndex
        ) {
            return styles.correctOptionNumber;
        }

        if (
            selectedAnswer === optionIndex &&
            selectedAnswer !==
            currentQuestion.correctAnswer
        ) {
            return styles.incorrectOptionNumber;
        }

        return styles.optionNumber;
    };

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

    if (!currentQuestion) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorTitle}>
                    Question not found
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

            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length}
                    </Text>

                    <Text style={styles.scoreText}>
                        Score: {score}
                    </Text>
                </View>

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${((currentQuestionIndex + 1) /
                                    questions.length) *
                                    100
                                    }%`,
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.questionCard}>
                <Text style={styles.questionNumber}>
                    Question {currentQuestionIndex + 1}
                </Text>

                <Text style={styles.questionText}>
                    {currentQuestion.question}
                </Text>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map(
                        (option, optionIndex) => (
                            <Pressable
                                key={`${currentQuestion._id}-${optionIndex}`}
                                style={getOptionStyle(
                                    optionIndex
                                )}
                                onPress={() =>
                                    handleSelectAnswer(
                                        optionIndex
                                    )
                                }
                                disabled={submitted}
                            >
                                <View
                                    style={getOptionNumberStyle(
                                        optionIndex
                                    )}
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

            {!submitted && (
                <Pressable
                    style={[
                        styles.primaryButton,
                        selectedAnswer === null &&
                        styles.disabledButton,
                    ]}
                    disabled={selectedAnswer === null}
                    onPress={handleCheckAnswer}
                >
                    <Text style={styles.primaryButtonText}>
                        Check Answer
                    </Text>
                </Pressable>
            )}

            {submitted && (
                <View style={styles.resultCard}>
                    {selectedAnswer ===
                        currentQuestion.correctAnswer ? (
                        <Text style={styles.correctTitle}>
                            ✓ Correct!
                        </Text>
                    ) : (
                        <Text style={styles.incorrectTitle}>
                            ✕ Incorrect
                        </Text>
                    )}

                    {selectedAnswer !==
                        currentQuestion.correctAnswer && (
                            <Text style={styles.correctAnswerText}>
                                Correct answer:{" "}
                                {String.fromCharCode(
                                    65 +
                                    currentQuestion.correctAnswer
                                )}
                            </Text>
                        )}

                    <Text style={styles.explanationTitle}>
                        Explanation
                    </Text>

                    <Text style={styles.explanationText}>
                        {currentQuestion.explanation}
                    </Text>
                </View>
            )}

            {submitted && !isLastQuestion && (
                <Pressable
                    style={styles.primaryButton}
                    onPress={handleNextQuestion}
                >
                    <Text style={styles.primaryButtonText}>
                        Next Question
                    </Text>
                </Pressable>
            )}

            {submitted && isLastQuestion && (
                <View style={styles.lastQuestionSection}>
                    <View style={styles.lastQuestionMessage}>
                        <Text style={styles.lastQuestionText}>
                            You have completed all questions.
                        </Text>

                        <Text style={styles.lastQuestionScore}>
                            Current score:{" "}
                            {score +
                                (selectedAnswer ===
                                    currentQuestion.correctAnswer
                                    ? 1
                                    : 0)}{" "}
                            / {questions.length}
                        </Text>
                    </View>

                    <Pressable
                        style={styles.primaryButton}
                        onPress={handleFinishQuiz}
                    >
                        <Text style={styles.primaryButtonText}>
                            View Results
                        </Text>
                    </Pressable>
                </View>
            )}
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

    questionCount: {
        marginTop: spacing.sm,
        ...typography.caption,
        color: colors.textSecondary,
    },

    progressSection: {
        marginBottom: 18,
    },

    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    progressText: {
        ...typography.caption,
        color: colors.textPrimary,
    },

    scoreText: {
        ...typography.caption,
        color: colors.primary,
    },

    progressTrack: {
        height: 8,
        marginTop: 10,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: colors.border,
    },

    progressFill: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },

    questionCard: {
        padding: spacing.lg,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
    },

    questionNumber: {
        ...typography.overline,
        color: colors.primary,
    },
    lastQuestionSection: {
        marginTop: 20,
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
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        backgroundColor: colors.card,
        flexDirection: "row",
        alignItems: "center",
    },

    selectedOption: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryLight,
        flexDirection: "row",
        alignItems: "center",
    },

    correctOption: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: colors.success,
        borderRadius: borderRadius.md,
        backgroundColor: colors.successLight,
        flexDirection: "row",
        alignItems: "center",
    },

    incorrectOption: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: colors.error,
        borderRadius: borderRadius.md,
        backgroundColor: colors.errorLight,
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
        borderColor: colors.border,
    },

    selectedOptionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.primary,
    },

    correctOptionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.success,
    },

    incorrectOptionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.error,
    },

    optionNumberText: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: "700",
    },

    optionText: {
        flex: 1,
        marginLeft: spacing.md,
        ...typography.bodySm,
        color: colors.textPrimary,
    },

    primaryButton: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: "center",
        backgroundColor: colors.primary,
    },

    primaryButtonText: {
        color: colors.card,
        ...typography.caption,
        fontWeight: "700",
    },

    disabledButton: {
        opacity: 0.4,
    },

    resultCard: {
        marginTop: spacing.xl,
        padding: spacing.lg,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
    },

    correctTitle: {
        ...typography.title,
        color: colors.success,
    },

    incorrectTitle: {
        ...typography.title,
        color: colors.error,
    },

    correctAnswerText: {
        marginTop: spacing.sm,
        ...typography.bodySm,
        color: colors.textPrimary,
        fontWeight: "700",
    },

    explanationTitle: {
        marginTop: spacing.lg,
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: "700",
    },

    explanationText: {
        marginTop: spacing.sm,
        ...typography.bodySm,
        color: colors.textSecondary,
    },

    lastQuestionMessage: {
        marginTop: spacing.xl,
        padding: spacing.lg,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        alignItems: "center",
    },

    lastQuestionText: {
        ...typography.bodySm,
        color: colors.textSecondary,
        textAlign: "center",
    },

    lastQuestionScore: {
        marginTop: spacing.sm,
        ...typography.subtitle,
        color: colors.primary,
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
        ...typography.title,
        color: colors.textPrimary,
        textAlign: "center",
    },

    emptyText: {
        marginTop: spacing.sm,
        ...typography.bodySm,
        color: colors.textSecondary,
        textAlign: "center",
    },
});