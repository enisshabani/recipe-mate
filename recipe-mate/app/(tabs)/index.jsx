import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/recipeCard";
import { useLocalSearchParams, useRouter, Link } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const [recipes, setRecipes] = useState([
    {
      id: "1",
      title: "Spaghetti",
      time: "15 min",
      servings: 2,
      ingredients: ["Pasta", "Tomato", "Oil"],
      instructions: "Boil pasta and mix with sauce.",
      description: "A simple Italian classic.",
    },
  ]);

  const params = useLocalSearchParams();

  useEffect(() => {
    const raw = params.recipeData;
    if (!raw) return;

    let incomingRecipe = null;
    try {
      incomingRecipe = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (!incomingRecipe?.id) return;

    setRecipes((prev) => {
      const parsedIngredients = Array.isArray(incomingRecipe.ingredients)
        ? incomingRecipe.ingredients
        : String(incomingRecipe.ingredients || "").split("\n");

      const exists = prev.some((r) => r.id === incomingRecipe.id);

      if (exists) {
        return prev.map((recipe) =>
          recipe.id === incomingRecipe.id
            ? { ...recipe, ...incomingRecipe, ingredients: parsedIngredients }
            : recipe
        );
      }

      return [...prev, { ...incomingRecipe, ingredients: parsedIngredients }];
    });
  }, [params.recipeData]);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Mate</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#777" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a recipe"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => {
            if (searchQuery.trim() !== "" && !recentSearches.includes(searchQuery)) {
              setRecentSearches((prev) => [...prev, searchQuery]);
            }
          }}
        />
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.recentRow}>
          <Text style={styles.recentLabel}>Recent:</Text>
          <View style={styles.recentTagRow}>
            {recentSearches.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentTag}
                onPress={() => setSearchQuery(term)}
              >
                <Text style={styles.recentTagText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 38,
    backgroundColor: "#2e573a",
    borderBottomWidth: 1,
    borderBottomColor: "#2e573a",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fde3cf",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: "#F8a91f",
    paddingHorizontal: 22,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fde3cf",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 6,
    gap: 8,
  },
  recentLabel: {
    fontSize: 14,
    color: "#666",
  },
  recentTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  recentTag: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  recentTagText: {
    fontSize: 13,
    color: "#333",
  },
});
