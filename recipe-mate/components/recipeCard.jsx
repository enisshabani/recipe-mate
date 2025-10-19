// Komponent UI i ndarë 
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RecipeCard({ recipe }) {
  const router = useRouter();

  // Destructure properties from the recipe prop for cleaner usage
  const { id, title, time, servings, ingredients, category } = recipe;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/recipe",
          params: {
            currentRecipe: JSON.stringify(recipe),
          },
        });
      }}
    >
      {/* Titulli */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.infoRow}>
          {/* Ikona e kohës */}
          {time && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#555" />
              <Text style={styles.infoText}>{time}</Text>
            </View>
          )}

          {/* Ikona e servings */}
          {servings && (
            <View style={styles.infoRow}>
              <Ionicons name="people-outline" size={16} color="#0077cc" />
              <Text style={styles.infoText}>{servings}</Text>
            </View>
          )}

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/recipe",
                params: { currentRecipe: JSON.stringify(recipe) },
              })
            }
          >
            <Ionicons name="create-outline" size={18} color="#8B4513" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Kategoria */}
      {category && <Text style={styles.category}>{category}</Text>}

      {/* Ingredients link */}
      <Text style={styles.ingredientsText}>
        {ingredients.length} ingredients
      </Text>
    </TouchableOpacity>
  );
}

// 🎨 Stilizimi bazik i kartës
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F8a91f",
    shadowColor: "#F8a91f",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 13,
    fontFamily: "System",
    color: "#555",
  },
  category: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "System",
    color: "#666",
  },
  ingredientsText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "System",
    color: "#000",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 10,
  },
  editButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "System",
  },
});
