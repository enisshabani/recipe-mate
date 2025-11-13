import { useEffect } from "react";
import { Stack } from "expo-router";
import { RecipeProvider } from "../contexts/RecipeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutContent() {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while loading authentication state
  if (loading) {
    return null;
  }

  return (
    <RecipeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add" />
            <Stack.Screen name="recipe" />
            <Stack.Screen name="editRecipe" />
          </>
        ) : (
          <Stack.Screen name="(auth)" />
        )}
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