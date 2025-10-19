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
        headerShown: false,
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
          elevation: 6, 
        },
        tabBarActiveTintColor: "#2e573a",
        tabBarInactiveTintColor: "#aaaaaa",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
      
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" 
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
