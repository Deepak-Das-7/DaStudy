import {
    Pressable,
    StyleSheet,
    Text,
} from "react-native";
import { borderRadius, colors, spacing, typography } from "../constants/theme";

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
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderWidth: 1,
        borderColor: colors.primaryMuted,
        borderRadius: borderRadius.md,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: spacing.sm,
        backgroundColor: colors.card,
    },

    icon: {
        fontSize: 18,
        color: colors.primary,
    },

    text: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: "700",
    },
});