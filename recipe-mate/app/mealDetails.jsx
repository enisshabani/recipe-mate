import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRecipes } from "../contexts/RecipeContext";

export default function MealDetails() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState(null);
  const router = useRouter();
  const { addRecipe, addToFavorites, isFavorite, removeFromFavorites } =
    useRecipes();

  useEffect(() => {
    const loadMeal = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          setMeal(data.meals[0]);
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };

    loadMeal();
  }, [id]);

  if (!meal) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${measure} ${ing}`);
    }
  }

  const cookingTime = "30 min";
  const servings = 3;

  const normalizedRecipe = {
    id: meal.idMeal,
    title: meal.strMeal,
    description: meal.strMeal,
    image: meal.strMealThumb,
    ingredients,
    category: meal.strCategory,
    servings,
    time: cookingTime,
    instructions: meal.strInstructions || "",
  };

  const favorite = isFavorite(normalizedRecipe.id);

  const handleSaveToMyRecipes = async () => {
    await addRecipe({
      title: meal.strMeal,
      description: meal.strMeal,
      image: meal.strMealThumb,
      ingredients,
      category: meal.strCategory,
      servings,
      time: cookingTime,
      instructions: meal.strInstructions || "",
    });
    router.push("/");
  };

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(normalizedRecipe.id);
    } else {
      addToFavorites(normalizedRecipe);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        {/* 🔙 NEW BACK BUTTON */}
        <TouchableOpacity style={styles.backButtonNew} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

        <Text style={styles.title}>{meal.strMeal}</Text>
        <Text style={styles.category}>{meal.strCategory}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={20} color="#F4A300" />
            <Text style={styles.infoText}>{cookingTime}</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="people-outline" size={20} color="#F4A300" />
            <Text style={styles.infoText}>{servings} servings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((item, index) => (
          <Text key={index} style={styles.ingredient}>
            • {item}
          </Text>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleSaveToMyRecipes}
        >
          <Text style={styles.actionButtonText}>Save to My Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton]}
          onPress={handleToggleFavorite}
        >
          <Text style={styles.actionButtonText}>
            {favorite ? "Remove Favorite" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 40, textAlign: "center", fontSize: 18 },

  container: {
    backgroundColor: "#fff",
    flex: 1,
  },

  backButtonNew: {
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 2,
    paddingLeft: 20,
    backgroundColor: "#2e573a"
  },

  backText: {
    fontSize: 18,
    color: "#fde3cf",
    fontWeight: "600",

  },

  image: {
    height: 260,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 16,
    color: "#333",
    marginLeft: 20,
  },

  category: {
    fontSize: 16,
    color: "#777",
    marginBottom: 15,
    marginLeft: 20,
  },

  infoRow: {
    flexDirection: "row",
    marginVertical: 12,
    marginLeft: 10,
  },

  infoBox: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF4D6",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    paddingBottom: 10,
    marginBottom: 10,
    width: 120,
    marginHorizontal: 10,
  },

  infoText: { fontSize: 14, fontWeight: "600", color: "#333" },

  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, marginLeft: 20, },

  ingredient: { fontSize: 15, color: "#444", marginBottom: 4, marginLeft: 20, },

  stickyButtonContainer: {
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#F4A300",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryButton: {
    backgroundColor: "#2e573a",
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
