// Plotësim kërkese: Navigim bazik 
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <>
     <StatusBar barStyle="dark-content" backgroundColor="#F8F5F2" />
    <Tabs
      screenOptions={{
        headerShown: false, // Heq header default që na jep Expo
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          borderTopColor: "#ddd",
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 6, // per Android
        },
        tabBarActiveTintColor: "#2e573a", // ngjyra kryesore (e gjelbërt e errët)
        tabBarInactiveTintColor: "#aaaaaa",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
      
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index" // kjo lidhet me index.tsx automatikisht
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/*  Add Recipe Tab */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      {/*  Profile Tab */}
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
    </>
  );
}
