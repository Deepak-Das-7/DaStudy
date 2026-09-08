import {
    Pressable,
    StyleSheet,
    Text,
} from "react-native";

type BookmarkButtonProps = {
    bookmarked: boolean;
    onPress: () => void;
};

export default function BookmarkButton({
    bookmarked,
    onPress,
}: BookmarkButtonProps) {
    return (
        <Pressable
            style={styles.button}
            onPress={onPress}
        >
            <Text style={styles.icon}>
                {bookmarked ? "★" : "☆"}
            </Text>

            <Text style={styles.text}>
                {bookmarked
                    ? "Bookmarked"
                    : "Bookmark"}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },

    icon: {
        fontSize: 20,
    },

    text: {
        fontSize: 15,
        fontWeight: "600",
    },
});