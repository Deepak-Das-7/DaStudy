import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";

type ClassItem = {
    id: number;
    name: string;
};

const classes: ClassItem[] = [
    {
        id: 1,
        name: "Class 1",
    },
    {
        id: 2,
        name: "Class 2",
    },
    {
        id: 3,
        name: "Class 3",
    },
    {
        id: 4,
        name: "Class 4",
    },
    {
        id: 5,
        name: "Class 5",
    },
    {
        id: 6,
        name: "Class 6",
    },
    {
        id: 7,
        name: "Class 7",
    },
    {
        id: 8,
        name: "Class 8",
    },
    {
        id: 9,
        name: "Class 9",
    },
    {
        id: 10,
        name: "Class 10",
    },
    {
        id: 11,
        name: "Class 11",
    },
    {
        id: 12,
        name: "Class 12",
    },
];

export default function ClassesScreen() {
    const handleClassPress = (classNumber: number) => {
        router.push({
            pathname: "/subjects",
            params: {
                classNumber: classNumber.toString(),
            },
        });
    };

    const renderClass = ({ item }: { item: ClassItem }) => {
        return (
            <Pressable
                style={styles.classCard}
                onPress={() => handleClassPress(item.id)}
            >
                <View style={styles.classNumberContainer}>
                    <Text style={styles.classNumber}>
                        {item.id}
                    </Text>
                </View>

                <View style={styles.classInfo}>
                    <Text style={styles.className}>
                        {item.name}
                    </Text>

                    <Text style={styles.classSubtitle}>
                        View subjects
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
                    Choose Your Class
                </Text>

                <Text style={styles.subtitle}>
                    Select your class to start learning.
                </Text>
            </View>

            <FlatList
                data={classes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderClass}
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

    subtitle: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },

    list: {
        paddingBottom: 24,
    },

    classCard: {
        minHeight: 72,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    classNumberContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    classNumber: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

    classInfo: {
        flex: 1,
        marginLeft: 14,
    },

    className: {
        fontSize: 17,
        fontWeight: "600",
    },

    classSubtitle: {
        marginTop: 3,
        fontSize: 13,
    },

    arrow: {
        fontSize: 28,
        marginLeft: 8,
    },
});