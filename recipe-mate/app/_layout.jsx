import { useEffect } from "react";
import { Stack } from "expo-router";
import { RecipeProvider } from "../contexts/RecipeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutContent() {
  return (
    <RecipeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="add" />
        <Stack.Screen name="recipe" />
        <Stack.Screen name="editRecipe" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="mealDetails" />
      </Stack>
    </RecipeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}