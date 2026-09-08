import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

export default function QuizResultScreen() {
    const {
        score,
        total,
        chapterId,
        chapterNumber,
        chapterName,
        classNumber,
        subjectName,
    } = useLocalSearchParams<{
        score?: string;
        total?: string;
        chapterId?: string;
        chapterNumber?: string;
        chapterName?: string;
        classNumber?: string;
        subjectName?: string;
    }>();

    const scoreNumber = Number(score) || 0;
    const totalNumber = Number(total) || 0;

    const incorrectNumber =
        Math.max(totalNumber - scoreNumber, 0);

    const percentage =
        totalNumber > 0
            ? (scoreNumber / totalNumber) * 100
            : 0;

    const formattedPercentage =
        percentage.toFixed(1);

    const getResultMessage = (): string => {
        if (percentage >= 80) {
            return "Excellent work! Keep it up.";
        }

        if (percentage >= 60) {
            return "Good job! A little more practice will help.";
        }

        if (percentage >= 40) {
            return "Nice attempt! Review the chapter and try again.";
        }

        return "Keep practicing. You will improve with practice.";
    };

    const handleRetry = (): void => {
        if (!chapterId) {
            router.back();
            return;
        }

        router.replace({
            pathname: "/chapter/questions",
            params: {
                chapterId,
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

    const handleBackToChapter = (): void => {
        if (!chapterId) {
            router.back();
            return;
        }

        router.replace({
            pathname: `/chapter/${chapterId}`,
            params: {
                classNumber: classNumber ?? "",
                subjectName: subjectName ?? "",
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    Quiz Complete!
                </Text>

                <Text style={styles.chapterName}>
                    {chapterName}
                </Text>

                <Text style={styles.subtitle}>
                    Class {classNumber} • {subjectName}
                </Text>

                <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>
                        Your Score
                    </Text>

                    <Text style={styles.score}>
                        {scoreNumber} / {totalNumber}
                    </Text>

                    <Text style={styles.percentage}>
                        {formattedPercentage}%
                    </Text>

                    <Text style={styles.message}>
                        {getResultMessage()}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {scoreNumber}
                        </Text>

                        <Text style={styles.statLabel}>
                            Correct
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {incorrectNumber}
                        </Text>

                        <Text style={styles.statLabel}>
                            Incorrect
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {totalNumber}
                        </Text>

                        <Text style={styles.statLabel}>
                            Total
                        </Text>
                    </View>
                </View>

                <Pressable
                    style={styles.primaryButton}
                    onPress={handleRetry}
                >
                    <Text style={styles.primaryButtonText}>
                        Retry Quiz
                    </Text>
                </Pressable>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={handleBackToChapter}
                >
                    <Text style={styles.secondaryButtonText}>
                        Back to Chapter
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
    },

    title: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: "700",
        textAlign: "center",
    },

    chapterName: {
        marginTop: 10,
        fontSize: 19,
        lineHeight: 27,
        fontWeight: "600",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 6,
        fontSize: 14,
        textAlign: "center",
    },

    scoreCard: {
        marginTop: 30,
        padding: 24,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 16,
        alignItems: "center",
    },

    scoreLabel: {
        fontSize: 14,
        fontWeight: "600",
    },

    score: {
        marginTop: 10,
        fontSize: 42,
        lineHeight: 50,
        fontWeight: "700",
    },

    percentage: {
        marginTop: 4,
        fontSize: 22,
        fontWeight: "600",
    },

    message: {
        marginTop: 14,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },

    statsContainer: {
        marginTop: 16,
        flexDirection: "row",
        gap: 10,
    },

    statCard: {
        flex: 1,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 12,
        alignItems: "center",
    },

    statValue: {
        fontSize: 22,
        fontWeight: "700",
    },

    statLabel: {
        marginTop: 5,
        fontSize: 12,
    },

    primaryButton: {
        marginTop: 24,
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

    secondaryButton: {
        marginTop: 12,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#dddddd",
    },

    secondaryButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },
});