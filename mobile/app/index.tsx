import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { colors, shadows, spacing, borderRadius, typography } from "../src/constants/theme";

export default function HomeScreen() {
    const handleStartStudying = () => {
        router.push("/classes");
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <View style={styles.container}>
                <View style={styles.decorationContainer}>
                    <View style={[styles.decorationCircle, styles.circle1]} />
                    <View style={[styles.decorationCircle, styles.circle2]} />
                    <View style={[styles.decorationBlob, styles.blob1]} />
                    <View style={[styles.decorationBlob, styles.blob2]} />
                </View>

                <View style={styles.content}>
                    <View style={styles.brandContainer}>
                        <View style={styles.brandBadge}>
                            <Text style={styles.brandBadgeText}>📚</Text>
                        </View>
                        <Text style={styles.appName}>DaStudy</Text>
                    </View>

                    <View style={styles.heroSection}>
                        <Text style={styles.title}>
                            Learn. Practice.{"\n"}
                            <Text style={styles.titleAccent}>Grow.</Text>
                        </Text>

                        <View style={styles.featureRow}>
                            <View style={styles.featureDot} />
                            <Text style={styles.description}>
                                Comprehensive study notes for every chapter
                            </Text>
                        </View>

                        <View style={styles.featureRow}>
                            <View style={styles.featureDot} />
                            <Text style={styles.description}>
                                Curated video lectures from top educators
                            </Text>
                        </View>

                        <View style={styles.featureRow}>
                            <View style={styles.featureDot} />
                            <Text style={styles.description}>
                                Practice questions to test your knowledge
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleStartStudying}
                    >
                        <Text style={styles.buttonText}>Start Studying</Text>
                        <View style={styles.buttonArrow}>
                            <Text style={styles.buttonArrowText}>→</Text>
                        </View>
                    </Pressable>
                </View>

                <View style={styles.footerContainer}>
                    <View style={styles.footerBadge}>
                        <Text style={styles.footerBadgeDot} />
                        <Text style={styles.footer}>Free & Open Source</Text>
                    </View>
                </View>
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
        paddingTop: spacing.xxl,
        justifyContent: "space-between",
        overflow: "hidden",
    },

    decorationContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
    },

    decorationCircle: {
        position: "absolute",
        borderRadius: 999,
        opacity: 0.4,
    },

    circle1: {
        width: 300,
        height: 300,
        top: -120,
        right: -100,
        backgroundColor: colors.primaryLight,
    },

    circle2: {
        width: 200,
        height: 200,
        bottom: 80,
        left: -80,
        backgroundColor: colors.subjectScience,
    },

    decorationBlob: {
        position: "absolute",
        opacity: 0.35,
    },

    blob1: {
        width: 140,
        height: 140,
        top: 180,
        left: -40,
        borderRadius: 70,
        backgroundColor: colors.subjectHistory,
    },

    blob2: {
        width: 100,
        height: 100,
        bottom: 220,
        right: -20,
        borderRadius: 50,
        backgroundColor: colors.subjectGeography,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        zIndex: 1,
    },

    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.xxxl,
    },

    brandBadge: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },

    brandBadgeText: {
        fontSize: 22,
    },

    appName: {
        fontSize: 19,
        fontWeight: "800",
        color: colors.primary,
        letterSpacing: -0.3,
    },

    heroSection: {
        marginBottom: spacing.xxxl,
    },

    title: {
        ...typography.h1,
        color: colors.textPrimary,
        marginBottom: spacing.xxl,
        letterSpacing: -1,
    },

    titleAccent: {
        color: colors.primary,
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.md,
    },

    featureDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginRight: spacing.lg,
    },

    description: {
        ...typography.bodySm,
        color: colors.textSecondary,
        flex: 1,
    },

    button: {
        ...shadows.xl,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        paddingHorizontal: spacing.xxl,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.primary,
    },

    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.3,
    },

    buttonArrow: {
        marginLeft: spacing.sm,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonArrowText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    footerContainer: {
        paddingBottom: spacing.lg,
        alignItems: "center",
        zIndex: 1,
    },

    footerBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.pill,
        backgroundColor: colors.card,
        ...shadows.sm,
    },

    footerBadgeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
        marginRight: spacing.sm,
    },

    footer: {
        ...typography.captionSm,
        color: colors.textSecondary,
        fontWeight: "600",
    },
});
