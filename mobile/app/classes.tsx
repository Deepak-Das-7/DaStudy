import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Animated } from "react-native";

import { api } from "../src/services/api";
import type { ClassItem, ClassesResponse } from "../src/types/class";
import {
    colors,
    shadows,
    spacing,
    borderRadius,
    typography,
    getClassColor,
} from "../src/constants/theme";
import { API_ENDPOINTS } from "../src/constants/api";

// Extracted ClassCard component with its own animations
const ClassCard = ({
    item,
    index,
    onPress,
}: {
    item: ClassItem;
    index: number;
    onPress: (classId: string, classNumber: number) => void;
}) => {
    const bgColor = getClassColor(item.classNumber);
    const delay = index * 80;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
            }}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.classCard,
                    { borderLeftColor: bgColor },
                    pressed && styles.classCardPressed,
                ]}
                onPress={() => onPress(item._id, item.classNumber)}
            >
                <View style={[styles.classNumberContainer, { backgroundColor: bgColor }]}>
                    <Text style={styles.classNumber}>{item.classNumber}</Text>
                </View>

                <View style={styles.classInfo}>
                    <Text style={styles.className}>{item.name}</Text>
                    <Text style={styles.classSubtitle}>
                        {item.subjectCount || 0} subjects • Explore →
                    </Text>
                </View>

                <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default function ClassesScreen() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchClasses = async (): Promise<void> => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get<ClassesResponse>(
                API_ENDPOINTS.CLASSES
            );
            setClasses(response.data.data);
        } catch (error) {
            console.error("Failed to fetch classes:", error);
            setError("Unable to load classes. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchClasses();
    }, []);

    const handleClassPress = (classId: string, classNumber: number) => {
        router.push({
            pathname: "/subjects",
            params: { classId, classNumber: classNumber.toString() },
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={styles.loadingIconContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                    <Text style={styles.loadingText}>Loading classes...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.centerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.errorLight }]}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                    </View>
                    <Text style={styles.errorTitle}>Something went wrong</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={() => void fetchClasses()}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerIconContainer}>
                        <Text style={styles.headerIcon}>🎓</Text>
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Choose Your Class</Text>
                        <Text style={styles.subtitle}>
                            Select your grade to access all subjects and materials.
                        </Text>
                    </View>
                </View>
                <View style={styles.headerDivider} />
            </View>

            <FlatList
                data={classes}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <ClassCard item={item} index={index} onPress={handleClassPress} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
                ListFooterComponent={<View style={{ height: spacing.xxl }} />}
            />
        </View>
    );
}

// Keep the same styles as before (unchanged)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
    },
    header: {
        marginBottom: spacing.xl,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerIconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    headerIcon: {
        fontSize: 30,
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
        letterSpacing: 0,
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    headerDivider: {
        marginTop: spacing.md,
        height: 2,
        width: 40,
        borderRadius: 2,
        backgroundColor: colors.primary,
        opacity: 0.3,
    },
    list: {
        paddingBottom: spacing.xxxl,
    },
    classCard: {
        ...shadows.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        borderLeftWidth: 5,
        borderLeftColor: colors.primary,
        overflow: "hidden",
    },
    classCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    classNumberContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
    },
    classNumber: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.primary,
    },
    classInfo: {
        flex: 1,
        marginLeft: spacing.lg,
    },
    className: {
        ...typography.subtitle,
        color: colors.textPrimary,
        fontSize: 18,
    },
    classSubtitle: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: "600",
        marginTop: 2,
    },
    chevronContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
    chevron: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: "700",
        marginTop: -2,
        marginLeft: 2,
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
    loadingText: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: "500",
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