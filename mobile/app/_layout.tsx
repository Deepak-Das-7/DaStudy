import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors, typography } from "../src/constants/theme";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: colors.background },
                    headerShadowVisible: false,
                    headerTintColor: colors.primary,
                    headerTitleStyle: {
                        ...typography.subtitle,
                        color: colors.textPrimary,
                    },
                    headerBackTitle: " ",
                    headerBackButtonDisplayMode: "minimal",
                    headerTitleAlign: "left",
                    headerTransparent: false,
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="classes"
                    options={{
                        title: "Classes",
                    }}
                />

                <Stack.Screen
                    name="subjects"
                    options={{
                        title: "Subjects",
                    }}
                />

                <Stack.Screen
                    name="chapters"
                    options={{
                        title: "Chapters",
                    }}
                />
                <Stack.Screen
                    name="search"
                    options={{
                        title: "Search",
                    }}
                />
                <Stack.Screen
                    name="bookmarks"
                    options={{
                        title: "My Bookmarks",
                    }}
                />
                <Stack.Screen
                    name="chapter/[id]"
                    options={{
                        title: "Chapter Details",
                    }}
                />
                <Stack.Screen
                    name="chapter/notes"
                    options={{
                        title: "Notes",
                    }}
                />
                <Stack.Screen
                    name="chapter/videos"
                    options={{
                        title: "Video Lectures",
                    }}
                />
                <Stack.Screen
                    name="chapter/questions"
                    options={{
                        title: "Practice Questions",
                    }}
                />
                <Stack.Screen
                    name="chapter/quiz-result"
                    options={{
                        title: "Quiz Result",
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}
