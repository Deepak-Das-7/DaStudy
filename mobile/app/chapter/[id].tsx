import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

type ChapterData = {
    title: string;
    description: string;
};

const chapterData: Record<string, ChapterData> = {
    "chapter-1": {
        title: "Knowing Our Numbers",
        description:
            "Learn about numbers, number systems, large numbers, place values, and how numbers are used in everyday life.",
    },
    "chapter-2": {
        title: "Whole Numbers",
        description:
            "Understand whole numbers, their properties, number lines, and basic operations.",
    },
    "chapter-3": {
        title: "Playing with Numbers",
        description:
            "Explore factors, multiples, divisibility rules, prime numbers, and common number patterns.",
    },
    "chapter-4": {
        title: "Basic Geometrical Ideas",
        description:
            "Learn the basic concepts of points, lines, line segments, rays, angles, and simple geometrical shapes.",
    },
    "chapter-5": {
        title: "Understanding Elementary Shapes",
        description:
            "Learn about different shapes, angles, triangles, quadrilaterals, and basic geometric measurements.",
    },
};

export default function ChapterDetailsScreen() {
    const { id, classNumber, subjectId } =
        useLocalSearchParams<{
            id?: string;
            classNumber?: string;
            subjectId?: string;
        }>();

    const chapterId = id ?? "";

    const chapter = chapterData[chapterId];

    const subjectName = (subjectId ?? "")
        .split("-")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    const handleNotesPress = () => {
        console.log("Notes pressed");
    };

    const handleVideosPress = () => {
        console.log("Videos pressed");
    };

    const handlePracticePress = () => {
        console.log("Practice pressed");
    };

    if (!chapter) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>
                    Chapter Not Found
                </Text>

                <Text style={styles.errorText}>
                    The selected chapter could not be found.
                </Text>

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>
                        Go Back
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.classText}>
                    Class {classNumber}
                </Text>

                <Text style={styles.subjectText}>
                    {subjectName}
                </Text>

                <Text style={styles.chapterLabel}>
                    Chapter
                </Text>

                <Text style={styles.title}>
                    {chapter.title}
                </Text>
            </View>

            <View style={styles.descriptionCard}>
                <Text style={styles.sectionTitle}>
                    About this chapter
                </Text>

                <Text style={styles.description}>
                    {chapter.description}
                </Text>
            </View>

            <View style={styles.learningSection}>
                <Text style={styles.sectionTitle}>
                    Start Learning
                </Text>

                <Pressable
                    style={styles.optionCard}
                    onPress={handleNotesPress}
                >
                    <View style={styles.optionIcon}>
                        <Text style={styles.optionIconText}>
                            N
                        </Text>
                    </View>

                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>
                            Notes
                        </Text>

                        <Text style={styles.optionDescription}>
                            Read chapter notes and explanations.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                </Pressable>

                <Pressable
                    style={styles.optionCard}
                    onPress={handleVideosPress}
                >
                    <View style={styles.optionIcon}>
                        <Text style={styles.optionIconText}>
                            V
                        </Text>
                    </View>

                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>
                            Video Lectures
                        </Text>

                        <Text style={styles.optionDescription}>
                            Watch curated lectures from YouTube.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                </Pressable>

                <Pressable
                    style={styles.optionCard}
                    onPress={handlePracticePress}
                >
                    <View style={styles.optionIcon}>
                        <Text style={styles.optionIconText}>
                            Q
                        </Text>
                    </View>

                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>
                            Practice Questions
                        </Text>

                        <Text style={styles.optionDescription}>
                            Test your understanding with questions.
                        </Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        paddingTop: 8,
        paddingBottom: 24,
    },

    classText: {
        fontSize: 15,
        fontWeight: "600",
    },

    subjectText: {
        marginTop: 4,
        fontSize: 15,
    },

    chapterLabel: {
        marginTop: 24,
        fontSize: 14,
    },

    title: {
        marginTop: 6,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: "700",
    },

    descriptionCard: {
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    description: {
        marginTop: 10,
        fontSize: 15,
        lineHeight: 23,
    },

    learningSection: {
        marginTop: 28,
    },

    optionCard: {
        minHeight: 82,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    optionIconText: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "700",
    },

    optionContent: {
        flex: 1,
        marginLeft: 14,
    },

    optionTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    optionDescription: {
        marginTop: 4,
        fontSize: 13,
        lineHeight: 18,
    },

    arrow: {
        marginLeft: 8,
        fontSize: 28,
    },

    errorContainer: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    errorTitle: {
        fontSize: 24,
        fontWeight: "700",
    },

    errorText: {
        marginTop: 10,
        fontSize: 15,
        textAlign: "center",
    },

    backButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: "#000000",
    },

    backButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
});