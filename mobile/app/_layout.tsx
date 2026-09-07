import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Study App",
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
        </Stack>
    );
}