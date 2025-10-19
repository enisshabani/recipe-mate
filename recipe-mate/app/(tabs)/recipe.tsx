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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecipeScreen() {
  const router = useRouter();
  const { currentRecipe } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

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

  useEffect(() => {
    const loadFavorite = async () => {
      if (!recipe) return;
      try {
        const value = await AsyncStorage.getItem(`favorite_${recipe.id}`);
        if (value === "true") setIsFavorite(true);
      } catch {}
    };
    loadFavorite();
  }, [recipe]);

  const toggleFavorite = async () => {
    if (!recipe) return;
    try {
      const newValue = !isFavorite;
      setIsFavorite(newValue);
      await AsyncStorage.setItem(`favorite_${recipe.id}`, newValue.toString());
    } catch {}
  };

  const handleDelete = () => {
    if (!recipe) return;
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
              await AsyncStorage.removeItem(`favorite_${recipe.id}`);
            } catch {}
            router.back();
          },
        },
      ]
    );
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
          Loading Recipe...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color="#F8F5F4" />
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
          <Ionicons name="create-outline" size={22} color="#F8F5F4" />
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
              <Ionicons name="time-outline" color="#CA91A1" size={26} />
              <Text style={styles.infoLabel}>Cooking Time</Text>
              <Text style={styles.infoValue}>{recipe.time || "N/A"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people-outline" color="#CA91A1" size={26} />
              <Text style={styles.infoLabel}>Servings</Text>
              <Text style={styles.infoValue}>{recipe.servings || "N/A"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="list-outline" color="#CA91A1" size={26} />
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
          <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              color="#293251"
              size={18}
            />
            <Text style={styles.favoriteText}>
              {isFavorite ? "Remove Favorite" : "Add to Favorites"}
            </Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" color="#293251" size={18} />
            <Text style={styles.deleteButtonText}>Delete Recipe</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EADFD8" },
  header: {
    backgroundColor: "#CA91A1",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    color: "#F8F5F4",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 4,
  },
  headerRight: { padding: 4 },
  contentContainer: { padding: 16 },
  mainCard: {
    backgroundColor: "#293251",
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#F8F5F4",
    textAlign: "center",
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 16,
    color: "#F8F5F4",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 16,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  infoItem: { alignItems: "center", flex: 1 },
  infoLabel: { fontSize: 14, color: "#CA91A1", marginTop: 6 },
  infoValue: { fontSize: 18, fontWeight: "700", color: "#F8F5F4" },
  card: {
    backgroundColor: "#293251",
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#F8F5F4", marginBottom: 10 },
  ingredientText: { fontSize: 16, color: "#F8F5F4", lineHeight: 22 },
  instructionText: { fontSize: 16, color: "#F8F5F4", lineHeight: 22 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  favoriteButton: {
    flex: 1,
    backgroundColor: "#CA91A1",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#293251",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#CA91A1",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#293251",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 6,
  },
  bottomSpacer: { height: Platform.OS === "ios" ? 40 : 80 },
});
