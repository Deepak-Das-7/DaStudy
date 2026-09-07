import { View, Text, Pressable, StyleSheet } from "react-native";

export default function ChaptersScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chapters</Text>

            <Pressable style={styles.item}>
                <Text style={styles.itemText}>Chapter 1 - Integers</Text>
            </Pressable>

            <Pressable style={styles.item}>
                <Text style={styles.itemText}>Chapter 2 - Fractions</Text>
            </Pressable>

            <Pressable style={styles.item}>
                <Text style={styles.itemText}>Chapter 3 - Decimals</Text>
            </Pressable>

            <Pressable style={styles.item}>
                <Text style={styles.itemText}>Chapter 4 - Data Handling</Text>
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