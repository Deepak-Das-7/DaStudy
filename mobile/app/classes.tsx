import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ClassesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Classes</Text>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/subjects")}
            >
                <Text style={styles.itemText}>Class 1</Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/subjects")}
            >
                <Text style={styles.itemText}>Class 6</Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/subjects")}
            >
                <Text style={styles.itemText}>Class 7</Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/subjects")}
            >
                <Text style={styles.itemText}>Class 10</Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/subjects")}
            >
                <Text style={styles.itemText}>Class 12</Text>
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