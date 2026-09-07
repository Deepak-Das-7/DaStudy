import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { api } from "../src/services/api";
import type {
    ClassItem,
    ClassesResponse,
} from "../src/types/class";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getClassColor,
} from "../src/constants/theme";

export default function ClassesScreen() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchClasses = async (): Promise<void> => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get<ClassesResponse>("/classes");

            setClasses(response.data.data);
        } catch (error) {
            console.error("Failed to fetch classes:", error);

            setError(
                "Unable to load classes. Please check your internet connection."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchClasses();
    }, []);

    const handleClassPress = (
        classId: string,
        classNumber: number
    ) => {
        router.push({
            pathname: "/subjects",
            params: {
                classId,
                classNumber: classNumber.toString(),
            },
        });
    };

    const renderClass = ({
        item,
    }: {
        item: ClassItem;
    }) => {
        const avatarBg = getClassColor(item.classNumber);

        return (
            <Pressable
                style={({ pressed }) => [
                    styles.classCard,
                    pressed && styles.classCardPressed,
                ]}
                onPress={() => handleClassPress(item._id, item.classNumber)}
            >
                <View style={[styles.classNumberContainer, { backgroundColor: avatarBg }]}>
                    <Text style={styles.classNumber}>
                        {item.classNumber}
                    </Text>
                </View>

                <View style={styles.classInfo}>
                    <Text style={styles.className}>
                        {item.name}
                    </Text>

                    <Text style={styles.classSubtitle}>
                        View subjects →
                    </Text>
                </View>

                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>

                    <Text style={styles.loadingText}>
                        Loading classes...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.errorLight }]}>
                        <Text style={styles.errorIcon}>⚠</Text>
                    </View>

                    <Text style={styles.errorTitle}>
                        Something went wrong
                    </Text>

                    <Text style={styles.errorText}>
                        {error}
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={() => {
                            void fetchClasses();
                        }}
                    >
                        <Text style={styles.retryButtonText}>
                            Retry
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>🎓</Text>
                    </View>
                    <Text style={styles.title}>
                        Choose Your Class
                    </Text>

                    <Text style={styles.subtitle}>
                        Select your class to start exploring subjects and chapters.
                    </Text>
                </View>

                <FlatList
                    data={classes}
                    keyExtractor={(item) => item._id}
                    renderItem={renderClass}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },

    container: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },

    centerContainer: {
        flex: 1,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingIconContainer: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },

    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.lg,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },

    errorIcon: {
        fontSize: 32,
    },

    header: {
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },

    headerBadge: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.lg,
    },

    headerBadgeText: {
        fontSize: 26,
    },

    title: {
        ...typography.h2,
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },

    subtitle: {
        marginTop: spacing.sm,
        ...typography.body,
        color: colors.textSecondary,
    },

    list: {
        paddingBottom: spacing.xxl,
    },

    classCard: {
        ...shadows.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        flexDirection: "row",
        alignItems: "center",
    },

    classCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },

    classNumberContainer: {
        width: 52,
        height: 52,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },

    classNumber: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: "800",
    },

    classInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },

    className: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },

    classSubtitle: {
        marginTop: spacing.xs,
        ...typography.caption,
        color: colors.primary,
        fontWeight: "600",
    },

    chevronContainer: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },

    chevron: {
        fontSize: 22,
        color: colors.primary,
        fontWeight: "700",
        marginTop: -2,
        marginLeft: 2,
    },

    loadingText: {
        marginTop: spacing.md,
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: "500",
    },

    errorTitle: {
        ...typography.title,
        color: colors.textPrimary,
        textAlign: "center",
    },

    errorText: {
        marginTop: spacing.sm,
        ...typography.bodySm,
        color: colors.textSecondary,
        lineHeight: 22,
        textAlign: "center",
    },

    retryButton: {
        ...shadows.xl,
        marginTop: spacing.xxl,
        paddingHorizontal: spacing.xxxl,
        paddingVertical: 16,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primary,
    },

    retryButtonText: {
        color: "#FFFFFF",
        ...typography.subtitle,
        fontWeight: "700",
    },

    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});
