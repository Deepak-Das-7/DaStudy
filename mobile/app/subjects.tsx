import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

type Subject = {
    id: string;
    name: string;
};

const subjects: Subject[] = [
    {
        id: "mathematics",
        name: "Mathematics",
    },
    {
        id: "science",
        name: "Science",
    },
    {
        id: "english",
        name: "English",
    },
    {
        id: "social-science",
        name: "Social Science",
    },
    {
        id: "hindi",
        name: "Hindi",
    },
];

export default function SubjectsScreen() {
    const { classNumber } = useLocalSearchParams<{
        classNumber?: string;
    }>();

    const selectedClass = classNumber ?? "";

    const handleSubjectPress = (subjectId: string) => {
        router.push({
            pathname: "/chapters",
            params: {
                classNumber: selectedClass,
                subjectId,
            },
        });
    };

    const renderSubject = ({ item }: { item: Subject }) => {
        return (
            <Pressable
                style={styles.subjectCard}
                onPress={() => handleSubjectPress(item.id)}
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
                    Subjects
                </Text>

                <Text style={styles.classText}>
                    Class {selectedClass}
                </Text>

                <Text style={styles.subtitle}>
                    Choose a subject to continue learning.
                </Text>
            </View>

            <FlatList
                data={subjects}
                keyExtractor={(item) => item.id}
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
        fontSize: 18,
        fontWeight: "600",
    },

    subtitle: {
        marginTop: 6,
        fontSize: 15,
        lineHeight: 22,
    },

    list: {
        paddingBottom: 24,
    },

    subjectCard: {
        minHeight: 76,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    subjectIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    subjectIconText: {
        color: "#ffffff",
        fontSize: 18,
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
});