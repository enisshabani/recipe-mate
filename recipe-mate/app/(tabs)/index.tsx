// Plotësim i kërkesës së fazës 1: Home Page UI me FlatList (pa backend, vetëm prototip)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/recipeCard";
import { useLocalSearchParams, useRouter } from "expo-router";

const router = useRouter();

export default function HomeScreen() {
  const [addedOnce, setAddedOnce] = useState(false);

  // Shembull i ni recete statike
  const [recipes, setRecipes] = useState([
    {
      id: "1",
      title: "Spaghetti",
      time: "15 min",
      servings: 2,
      ingredients: ["Pasta", "Tomato", "Oil"],
    },
  ]);

  const params = useLocalSearchParams(); // Lexo nëse po vjen recetë e re

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
      // nuk len duplikate (edhe mas reload)
      if (prev.some((r) => r.id === newRecipe.id)) return prev;
      return [...prev, newRecipe];
    });
  }, [params.recipeData]); // prej recipeData

  return (
    <SafeAreaView style={styles.container}>
      {/* Header si në screenshot (titull + butoni add) */}
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Mate</Text>

        {/* Butoni Add – me navigim */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")} // ✅ Hap faqen add.jsx
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* kërkesa: FlatList për listim */}
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
      />
    </SafeAreaView>
  );
}

// 🎨 UI stilim sipas screenshot (tonë pastel me fokus në lexueshmëri)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F2", // ngjyrë shumë e zbehtë pastel si sfond
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B2F2F", // kafe e errët
  },
  addButton: {
    backgroundColor: "#8B4513", // kafe si në screenshot
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
