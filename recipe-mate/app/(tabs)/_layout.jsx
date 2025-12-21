import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Image, View } from "react-native";
import { Colors } from "../../constants/theme";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const [profileImage, setProfileImage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadProfileImage();
  }, [user]);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.log('Error loading profile image:', error);
      setProfileImage(null);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2e573a",
        tabBarInactiveTintColor: "#F4A300",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 2,
          borderTopColor: "#2e573a",
          height: Platform.OS === "ios" ? 88 : 70,
          paddingBottom: Platform.OS === "ios" ? 24 : 12,
          paddingTop: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          position: "absolute",
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={focused ? 28 : 24} 
              name={focused ? "home" : "home-outline"} 
              color={color}
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="searchMeal"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={focused ? 28 : 24} 
              name={focused ? "restaurant" : "restaurant-outline"} 
              color={color}
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              size={focused ? 28 : 24} 
              name={focused ? "timer" : "timer-outline"} 
              color={color}
              style={{
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            user && profileImage ? (
              <View style={{
                width: focused ? 28 : 24,
                height: focused ? 28 : 24,
                borderRadius: (focused ? 28 : 24) / 2,
                overflow: 'hidden',
                borderWidth: focused ? 2 : 0,
                borderColor: color,
              }}>
                <Image 
                  source={{ uri: profileImage }}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <Ionicons 
                size={focused ? 28 : 24} 
                name={focused ? "person" : "person-outline"} 
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              />
            )
          ),
        }}
      />
    </Tabs>
  );
}