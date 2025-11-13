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
  const { addRecipe } = useRecipes();

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

  // Extract ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${measure} ${ing}`);
    }
  }

  const cookingTime = "30 minutes";
  const servings = 3;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#333" />
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

        {/* Keep scrolling content clean */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ⭐ FIXED/STICKY SAVE BUTTON */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            addRecipe({
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
          }}
        >
          <Text style={styles.saveButtonText}>Save to My Recipes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 40, textAlign: "center", fontSize: 18 },
  container: { backgroundColor: "#fff", padding: 20, flex: 1 },

  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  image: { width: "100%", height: 260, borderRadius: 10, marginTop: 30 },
  title: { fontSize: 26, fontWeight: "800", marginTop: 16, color: "#333" },
  category: { fontSize: 16, color: "#777", marginBottom: 15 },

  infoRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 12,
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
  },

  infoText: { fontSize: 14, fontWeight: "600", color: "#333" },

  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  ingredient: { fontSize: 15, color: "#444", marginBottom: 4 },

  /* ⭐ FIX: STICKY FOOTER BUTTON */
  stickyButtonContainer: {
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },

  saveButton: {
    backgroundColor: "#F4A300",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
