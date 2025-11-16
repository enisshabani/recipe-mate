import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRecipes } from "../contexts/RecipeContext";

export default function RecipeScreen() {
  const router = useRouter();
  const { currentRecipe } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);

  const {
    deleteRecipe,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useRecipes();

  useEffect(() => {
    if (currentRecipe) {
      try {
        const parsed = JSON.parse(String(currentRecipe));
        setRecipe(parsed);
      } catch (err) {
        console.log("Error parsing recipe:", err);
      }
    }
  }, [currentRecipe]);

  const handleToggleFavorite = () => {
    if (!recipe) return;
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const handleDelete = () => {
    if (!recipe) return;

    if (recipe.id === "1") {
      Alert.alert(
        "Cannot Delete",
        "The default Spaghetti recipe cannot be deleted.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Delete Recipe",
      `Are you sure you want to delete "${recipe.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              deleteRecipe(recipe.id);
              router.replace("/");
            } catch (err) {
              console.log("Error deleting:", err);
            }
          },
        },
      ]
    );
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#2e573a", textAlign: "center", marginTop: 50 }}>
          Loading Recipe...
        </Text>
      </View>
    );
  }

  const favorite = isFavorite(recipe.id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color="#fde3cf" />
          <Text style={styles.headerTitle}>Recipe</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/editRecipe",
              params: { currentRecipe: JSON.stringify(recipe) },
            })
          }
          style={styles.headerRight}
        >
          <Ionicons name="create-outline" size={22} color="#fde3cf" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          {recipe.description ? (
            <Text style={styles.optionalText}>{recipe.description}</Text>
          ) : null}

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" color="#F8a91f" size={26} />
              <Text style={styles.infoLabel}>Cooking Time</Text>
              <Text style={styles.infoValue}>{recipe.time || "N/A"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people-outline" color="#F8a91f" size={26} />
              <Text style={styles.infoLabel}>Servings</Text>
              <Text style={styles.infoValue}>{recipe.servings || "N/A"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="list-outline" color="#F8a91f" size={26} />
              <Text style={styles.infoLabel}>Ingredients</Text>
              <Text style={styles.infoValue}>
                {recipe.ingredients?.length || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingredients</Text>
          <Text style={styles.ingredientText}>
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join("\n")
              : recipe.ingredients}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <Text style={styles.instructionText}>{recipe.instructions}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Pressable style={styles.favoriteButton} onPress={handleToggleFavorite}>
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              color="#2e573a"
              size={18}
            />
            <Text style={styles.favoriteText}>
              {favorite ? "Remove Favorite" : "Add to Favorites"}
            </Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" color="#2e573a" size={18} />
            <Text style={styles.deleteButtonText}>Delete Recipe</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCFB" },
  header: {
    backgroundColor: "#2e573a",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    color: "#fde3cf",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 4,
  },
  headerRight: { padding: 4 },
  contentContainer: { padding: 16 },
  mainCard: {
    backgroundColor: "#2e573a",
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fde3cf",
    textAlign: "center",
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 16,
    color: "#fde3cf",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 16,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  infoItem: { alignItems: "center", flex: 1 },
  infoLabel: { fontSize: 14, color: "#F8a91f", marginTop: 6 },
  infoValue: { fontSize: 18, fontWeight: "700", color: "#fde3cf" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
    borderColor: "#2e573a",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e573a",
    marginBottom: 10,
  },
  ingredientText: { fontSize: 16, color: "#2e573a", lineHeight: 22 },
  instructionText: { fontSize: 16, color: "#2e573a", lineHeight: 22 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  favoriteButton: {
    flex: 1,
    backgroundColor: "#F8a91f",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#2e573a",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#F8a91f",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#2e573a",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  bottomSpacer: { height: Platform.OS === "ios" ? 40 : 80 },
});
