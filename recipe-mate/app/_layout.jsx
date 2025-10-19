import { Stack } from "expo-router";
import { RecipeProvider } from "../contexts/RecipeContext";

export default function RootLayout() {
  return (
    <RecipeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" />
        <Stack.Screen name="recipe" />
        <Stack.Screen name="editRecipe" />
      </Stack>
    </RecipeProvider>
  );
}
