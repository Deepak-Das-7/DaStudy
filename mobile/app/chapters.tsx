import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

type Chapter = {
    id: string;
    chapterNumber: number;
    name: string;
};

const chapters: Chapter[] = [
    {
        id: "chapter-1",
        chapterNumber: 1,
        name: "Knowing Our Numbers",
    },
    {
        id: "chapter-2",
        chapterNumber: 2,
        name: "Whole Numbers",
    },
    {
        id: "chapter-3",
        chapterNumber: 3,
        name: "Playing with Numbers",
    },
    {
        id: "chapter-4",
        chapterNumber: 4,
        name: "Basic Geometrical Ideas",
    },
    {
        id: "chapter-5",
        chapterNumber: 5,
        name: "Understanding Elementary Shapes",
    },
];

export default function ChaptersScreen() {
    const { classNumber, subjectId } =
        useLocalSearchParams<{
            classNumber?: string;
            subjectId?: string;
        }>();

    const selectedClass = classNumber ?? "";
    const selectedSubject = subjectId ?? "";

    const subjectName = selectedSubject
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const handleChapterPress = (chapterId: string) => {
        router.push({
            pathname: "/chapter/[id]",
            params: {
                id: chapterId,
                classNumber: selectedClass,
                subjectId: selectedSubject,
            },
        });
    };

    const renderChapter = ({
        item,
    }: {
        item: Chapter;
    }) => {
        return (
            <Pressable
                style={styles.chapterCard}
                onPress={() => handleChapterPress(item.id)}
            >
                <View style={styles.chapterNumber}>
                    <Text style={styles.chapterNumberText}>
                        {item.chapterNumber}
                    </Text>
                </View>

                <View style={styles.chapterInfo}>
                    <Text style={styles.chapterLabel}>
                        Chapter {item.chapterNumber}
                    </Text>

                    <Text style={styles.chapterName}>
                        {item.name}
                    </Text>
                </View>

                <Text style={styles.arrow}>
                    ›
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Chapters
                </Text>

                <Text style={styles.classText}>
                    Class {selectedClass}
                </Text>

                <Text style={styles.subjectText}>
                    {subjectName}
                </Text>

                <Text style={styles.subtitle}>
                    Select a chapter to start studying.
                </Text>
            </View>

            <FlatList
                data={chapters}
                keyExtractor={(item) => item.id}
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

    title: {
        fontSize: 28,
        fontWeight: "700",
    },

    classText: {
        marginTop: 8,
        fontSize: 17,
        fontWeight: "600",
    },

    subjectText: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: "500",
    },

    subtitle: {
        marginTop: 6,
        fontSize: 15,
        lineHeight: 22,
    },

    list: {
        paddingBottom: 24,
    },

    chapterCard: {
        minHeight: 82,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    chapterNumber: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    chapterNumberText: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "700",
    },

    chapterInfo: {
        flex: 1,
        marginLeft: 14,
    },

    chapterLabel: {
        fontSize: 13,
        marginBottom: 3,
    },

    chapterName: {
        fontSize: 16,
        fontWeight: "600",
    },

    arrow: {
        fontSize: 28,
        marginLeft: 8,
    },
});