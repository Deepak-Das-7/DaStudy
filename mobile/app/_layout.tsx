import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#F8FAFC",
                    },
                    headerShadowVisible: false,
                    headerTintColor: "#4F46E5",
                    headerTitleStyle: {
                        fontWeight: "700",
                        fontSize: 17,
                        color: "#1E293B",
                    },
                    headerBackTitle: " ",
                    headerBackButtonDisplayMode: "minimal",
                    headerTitleAlign: "left",
                    headerTransparent: false,
                    contentStyle: {
                        backgroundColor: "#F8FAFC",
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
                    name="chapter/[id]"
                    options={{
                        title: "Chapter Details",
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}
