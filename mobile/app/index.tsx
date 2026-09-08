import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";

import { colors, shadows, spacing, borderRadius, typography } from "../src/constants/theme";
import { goToBookmarks, goToClasses, goToSearch } from "../src/services/navigation";

export default function HomeScreen() {
    // Entrance animations for the whole content
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Staggered animations for feature rows
    const featureFades = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;
    const featureSlides = useRef([
        new Animated.Value(20),
        new Animated.Value(20),
        new Animated.Value(20),
    ]).current;

    const buttonFade = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(20)).current;

    const handleBookmarks = (): void => {
        goToBookmarks();
    };

    useEffect(() => {
        // Main content entrance
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Staggered feature rows
        featureFades.forEach((fade, i) => {
            Animated.sequence([
                Animated.delay(i * 150 + 300),
                Animated.parallel([
                    Animated.timing(fade, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(featureSlides[i], {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        });

        // Button reveal
        Animated.sequence([
            Animated.delay(800),
            Animated.parallel([
                Animated.timing(buttonFade, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonSlide, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleStartStudying = () => {
        goToClasses();
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <View style={styles.container}>
                {/* Decorative elements – static for performance */}
                <View style={styles.decorationContainer}>
                    <View style={[styles.decorationCircle, styles.circle1]} />
                    <View style={[styles.decorationCircle, styles.circle2]} />
                    <View style={[styles.decorationBlob, styles.blob1]} />
                    <View style={[styles.decorationBlob, styles.blob2]} />
                </View>

                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Brand */}
                    <View style={styles.brandContainer}>
                        <View style={styles.brandBadge}>
                            <Text style={styles.brandBadgeText}>📚</Text>
                        </View>
                        <Text style={styles.appName}>DaStudy</Text>
                        <Pressable style={styles.searchButton} onPress={() => goToSearch()}>
                            <Text style={styles.searchIcon}>🔎</Text>
                        </Pressable>
                    </View>

                    {/* Hero */}
                    <View style={styles.heroSection}>
                        <Text style={styles.title}>
                            Learn. Practice.{"\n"}
                            <Text style={styles.titleAccent}>Grow.</Text>
                        </Text>

                        {[
                            "Comprehensive study notes for every chapter",
                            "Curated video lectures from top educators",
                            "Practice questions to test your knowledge",
                        ].map((text, i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.featureRow,
                                    {
                                        opacity: featureFades[i],
                                        transform: [{ translateY: featureSlides[i] }],
                                    },
                                ]}
                            >
                                <View style={styles.featureDot} />
                                <Text style={styles.description}>{text}</Text>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Bookmark Card – compact & styled */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.bookmarkCard,
                            pressed && styles.cardPressed,
                        ]}
                        onPress={handleBookmarks}
                    >
                        <View style={styles.bookmarkIconContainer}>
                            <Text style={styles.bookmarkIcon}>⭐</Text>
                        </View>
                        <View style={styles.bookmarkContent}>
                            <Text style={styles.bookmarkTitle}>My Bookmarks</Text>
                            <Text style={styles.bookmarkSubtitle}>
                                Access your saved study content
                            </Text>
                        </View>
                        <Text style={styles.bookmarkArrow}>›</Text>
                    </Pressable>

                    {/* Main Button */}
                    <Animated.View
                        style={{
                            opacity: buttonFade,
                            transform: [{ translateY: buttonSlide }],
                        }}
                    >
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
                    </Animated.View>
                </Animated.View>

                {/* Footer */}
                <Animated.View
                    style={[
                        styles.footerContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.footerBadge}>
                        <View style={styles.footerBadgeDot} />
                        <Text style={styles.footer}>Free & Open Source</Text>
                    </View>
                </Animated.View>
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

    // Decorative elements (unchanged)
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

    // Content
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
        width: 50,
        height: 50,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    brandBadgeText: {
        fontSize: 40,
    },
    appName: {
        fontSize: 60,
        fontWeight: "800",
        color: colors.primary,
        letterSpacing: 0,
        flex: 1,
    },
    searchButton: {
        padding: spacing.sm,
    },
    searchIcon: {
        fontSize: 40,
    },

    heroSection: {
        marginBottom: spacing.xxxl,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
        marginBottom: spacing.xxl,
        letterSpacing: 0,
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

    // ---- Bookmark Card (new, compact) ----
    bookmarkCard: {
        ...shadows.sm,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    bookmarkIconContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.warningLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing.md,
    },
    bookmarkIcon: {
        fontSize: 18,
    },
    bookmarkContent: {
        flex: 1,
    },
    bookmarkTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: "700",
    },
    bookmarkSubtitle: {
        ...typography.captionSm,
        color: colors.textSecondary,
        marginTop: 1,
    },
    bookmarkArrow: {
        fontSize: 22,
        color: colors.primary,
        fontWeight: "300",
        marginLeft: spacing.sm,
    },
    // ------------------------------

    // Main Button
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

    // Footer
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

    // Shared press state for cards
    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
});