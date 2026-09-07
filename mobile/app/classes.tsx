import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { api } from "../src/services/api";
import type {
    ClassItem,
    ClassesResponse,
} from "../src/types/class";

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

    const handleClassPress = (classNumber: number) => {
        router.push({
            pathname: "/subjects",
            params: {
                classNumber: classNumber.toString(),
            },
        });
    };

    const renderClass = ({
        item,
    }: {
        item: ClassItem;
    }) => {
        return (
            <Pressable
                style={styles.classCard}
                onPress={() => handleClassPress(item.classNumber)}
            >
                <View style={styles.classNumberContainer}>
                    <Text style={styles.classNumber}>
                        {item.classNumber}
                    </Text>
                </View>

                <View style={styles.classInfo}>
                    <Text style={styles.className}>
                        {item.name}
                    </Text>

                    <Text style={styles.classSubtitle}>
                        View subjects
                    </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />

                <Text style={styles.loadingText}>
                    Loading classes...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorTitle}>
                    Something went wrong
                </Text>

                <Text style={styles.errorText}>
                    {error}
                </Text>

                <Pressable
                    style={styles.retryButton}
                    onPress={() => {
                        void fetchClasses();
                    }}
                >
                    <Text style={styles.retryButtonText}>
                        Retry
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Choose Your Class
                </Text>

                <Text style={styles.subtitle}>
                    Select your class to start learning.
                </Text>
            </View>

            <FlatList
                data={classes}
                keyExtractor={(item) => item._id}
                renderItem={renderClass}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },

    centerContainer: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    header: {
        paddingTop: 24,
        paddingBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },

    list: {
        paddingBottom: 24,
    },

    classCard: {
        minHeight: 72,
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dddddd",
        flexDirection: "row",
        alignItems: "center",
    },

    classNumberContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
    },

    classNumber: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

    classInfo: {
        flex: 1,
        marginLeft: 14,
    },

    className: {
        fontSize: 17,
        fontWeight: "600",
    },

    classSubtitle: {
        marginTop: 3,
        fontSize: 13,
    },

    arrow: {
        fontSize: 28,
        marginLeft: 8,
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
    },

    errorTitle: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },

    errorText: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
    },

    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#000000",
    },

    retryButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
});