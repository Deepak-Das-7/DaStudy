import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function SubjectsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Subjects</Text>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/chapters")}
            >
                <Text style={styles.itemText}>Mathematics</Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/chapters")}
            >
                <Text style={styles.itemText}>Science</Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/chapters")}
            >
                <Text style={styles.itemText}>English</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 24,
    },

    item: {
        padding: 18,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
    },

    itemText: {
        fontSize: 18,
    },
});