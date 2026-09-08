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
    },

    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    header: {
        paddingTop: 24,
        paddingBottom: 20,
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

    progressSection: {
        marginBottom: 18,
    },

    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    progressText: {
        fontSize: 14,
        fontWeight: "600",
    },

    scoreText: {
        fontSize: 14,
        fontWeight: "600",
    },

    progressTrack: {
        height: 8,
        marginTop: 10,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "#eeeeee",
    },

    progressFill: {
        height: 8,
        borderRadius: 4,
        backgroundColor: "#000000",
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
        borderColor: "#dddddd",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    selectedOption: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    correctOption: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    incorrectOption: {
        minHeight: 52,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: "#888888",
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

    selectedOptionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#000000",
    },

    correctOptionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#000000",
    },

    incorrectOptionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#888888",
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

    primaryButton: {
        marginTop: 20,
        paddingHorizontal: 28,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#000000",
    },

    primaryButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },

    disabledButton: {
        opacity: 0.4,
    },

    resultCard: {
        marginTop: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 14,
    },

    correctTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    incorrectTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    correctAnswerText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "600",
    },

    explanationTitle: {
        marginTop: 18,
        fontSize: 15,
        fontWeight: "700",
    },

    explanationText: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 23,
    },

    lastQuestionMessage: {
        marginTop: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 14,
        alignItems: "center",
    },

    lastQuestionText: {
        fontSize: 15,
        textAlign: "center",
    },

    lastQuestionScore: {
        marginTop: 8,
        fontSize: 17,
        fontWeight: "700",
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