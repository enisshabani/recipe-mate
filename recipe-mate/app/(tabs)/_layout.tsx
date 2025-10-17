// app/(tabs)/_layout.tsx

// ✅ Plotësim kërkese faza 1: Navigim bazik me Tabs nga Expo Router, UI PA funksionalitet backend.
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Heq header default që na jep Expo
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#ddd",
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#8B4513", // ngjyrë kafe e butonit aktiv
        tabBarInactiveTintColor: "#999",
      }}
    >
      {/* 🏠 Home Tab */}
      <Tabs.Screen
        name="index" // kjo lidhet me index.tsx automatikisht
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 👤 Profile Tab (placeholder për fazën 1) */}
      <Tabs.Screen
        name="profile" // file ende nuk ekziston - vetëm për UI prototip
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
