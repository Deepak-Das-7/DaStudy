import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
    const handleStartStudying = () => {
        router.push("/classes");
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.appName}>DaStudy</Text>

                <Text style={styles.title}>
                    Learn. Practice. Grow.
                </Text>

                <Text style={styles.description}>
                    Study school subjects, read notes, watch lectures,
                    and practice questions — all in one place.
                </Text>

                <Pressable
                    style={styles.button}
                    onPress={handleStartStudying}
                >
                    <Text style={styles.buttonText}>
                        Start Studying
                    </Text>
                </Pressable>
            </View>

            <Text style={styles.footer}>
                Free & Open Source
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "space-between",
    },

    content: {
        flex: 1,
        justifyContent: "center",
    },

    appName: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 24,
    },

    title: {
        fontSize: 34,
        fontWeight: "700",
        lineHeight: 42,
    },

    description: {
        marginTop: 16,
        fontSize: 16,
        lineHeight: 24,
    },

    button: {
        marginTop: 32,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#000000",
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },

    footer: {
        textAlign: "center",
        fontSize: 13,
        marginBottom: 8,
    },
});