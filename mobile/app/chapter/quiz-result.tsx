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
import { borderRadius, colors, shadows, spacing, typography } from "../../src/constants/theme";

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
        backgroundColor: colors.background,
    },

    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        justifyContent: "center",
    },

    title: {
        ...typography.h1,
        color: colors.textPrimary,
        textAlign: "center",
    },

    chapterName: {
        marginTop: spacing.sm,
        ...typography.subtitle,
        color: colors.textPrimary,
        textAlign: "center",
    },

    subtitle: {
        marginTop: spacing.xs,
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: "center",
    },

    scoreCard: {
        ...shadows.md,
        marginTop: spacing.xxxl,
        padding: spacing.xxl,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.primaryMuted,
        borderRadius: borderRadius.lg,
        alignItems: "center",
    },

    scoreLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },

    score: {
        marginTop: spacing.sm,
        fontSize: 40,
        lineHeight: 48,
        fontWeight: "800",
        color: colors.primary,
    },

    percentage: {
        marginTop: spacing.xs,
        ...typography.title,
        color: colors.textPrimary,
    },

    message: {
        marginTop: spacing.md,
        ...typography.bodySm,
        color: colors.textSecondary,
        textAlign: "center",
    },

    statsContainer: {
        marginTop: spacing.md,
        flexDirection: "row",
        gap: spacing.sm,
    },

    statCard: {
        flex: 1,
        paddingVertical: spacing.md,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        alignItems: "center",
    },

    statValue: {
        ...typography.title,
        color: colors.primary,
    },

    statLabel: {
        marginTop: spacing.xs,
        ...typography.overline,
        color: colors.textSecondary,
    },

    primaryButton: {
        marginTop: spacing.xxl,
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

    secondaryButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border,
    },

    secondaryButtonText: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: "700",
    },
});