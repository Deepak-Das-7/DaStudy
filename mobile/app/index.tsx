import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Study App</Text>
            <Text style={styles.subtitle}>
                Learn. Practice. Grow.
            </Text>

            <Pressable
                style={styles.button}
                onPress={() => router.push("/classes")}
            >
                <Text style={styles.buttonText}>Start Studying</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 16,
    },

    button: {
        marginTop: 32,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 8,
        backgroundColor: "#000",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});