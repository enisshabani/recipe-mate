// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/recipeCard";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  const [recipes, setRecipes] = useState([
    {
      id: "1",
      title: "Spaghetti",
      time: "15 min",
      servings: 2,
      ingredients: ["Pasta", "Tomato", "Oil"],
    },
  ]);

  const router = useRouter();
  const params = useLocalSearchParams();
  const theme = useTheme();

  // ✅ Merr recetat e reja nga params.recipeData
  useEffect(() => {
    const raw = params.recipeData;
    if (!raw) return;

    let newRecipe: any = null;
    try {
      newRecipe = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (!newRecipe?.id) return;

    setRecipes((prev) => {
      if (prev.some((r) => r.id === newRecipe.id)) return prev;
      return [...prev, newRecipe];
    });
  }, [params.recipeData]);

  // ✅ Header Left dhe Right
  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => router.push("/add")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="plus" color={theme.colors.primary} />
    </TouchableOpacity>
  );

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => Alert.alert("Settings", "Not implemented yet")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={theme.colors.primary} />
    </TouchableOpacity>
  );

  return (
    <>
      {Platform.OS === "ios" && (
        <Stack.Screen
          options={{
            title: "Recipe Mate",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}

      <SafeAreaView style={styles.container}>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard
              id={item.id}
              title={item.title}
              time={item.time}
              servings={item.servings}
              ingredientsCount={item.ingredients.length}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="book" size={48} color="#A0522D" />
              </View>
              <Text style={styles.title}>Welcome to Recipe Mate</Text>
              <Text style={styles.description}>
                Your personal recipe collection and cooking companion.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F2",
  },
  listHeader: {
    alignItems: "center",
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B2F2F",
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
