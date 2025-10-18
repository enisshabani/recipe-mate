// app/(tabs)/_layout.tsx

import React from "react";
import { Platform } from "react-native";
import { Tabs, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FloatingTabBar, { TabBarItem } from "@/components/FloatingTabBar";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  // ✅ Define shared tab data (used by FloatingTabBar)
  const tabs: TabBarItem[] = [
    {
      route: "/(tabs)/index",
      label: "Home",
      icon: "house",
      activeIcon: "house.fill",
    },
    {
      route: "/(tabs)/profile",
      label: "Profile",
      icon: "person",
      activeIcon: "person.fill",
    },
  ];

  // ✅ Use native tab layout for iOS, FloatingTabBar for Android
  if (Platform.OS === "ios") {
    return (
      <NativeTabs>
        <NativeTabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Icon
                ios={{
                  name: focused ? "house.fill" : "house",
                  hierarchicalColor: "#A0522D",
                }}
                android={{
                  name: "home",
                }}
              />
            ),
            tabBarLabel: ({ focused }) => <Label focused={focused}>Home</Label>,
          }}
        />
        <NativeTabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Icon
                ios={{
                  name: focused ? "person.fill" : "person",
                  hierarchicalColor: "#A0522D",
                }}
                android={{
                  name: "person",
                }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Label focused={focused}>Profile</Label>
            ),
          }}
        />
      </NativeTabs>
    );
  }

  // ✅ Fallback for Android / web — Stack + FloatingTabBar
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
      </Stack>

      <FloatingTabBar tabs={tabs} />
    </>
  );
}
