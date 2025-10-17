// components/RecipeCard.tsx

// ✅ Komponent UI i ndarë - plotëson kërkesën e fazës 1 për organizim modular të kodit
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecipeCardProps {
  id: string;
  title: string;
  time: string; // shembull: "15 min"
  servings: number; // shembull: 2
  ingredientsCount: number;
  category?: string; // opsionale
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  time,
  servings,
  ingredientsCount,
  category,
}) => {
  return (
    <TouchableOpacity style={styles.card}>
      {/* Titulli */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        {/* Ikona e kohës */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        {/* Ikona e servings */}
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color="#0077cc" />
          <Text style={styles.infoText}>{servings}</Text>
        </View>
      </View>

      {/* Kategoria */}
      {category && <Text style={styles.category}>{category}</Text>}

      {/* Ingredients link */}
      <Text style={styles.ingredientsText}>{ingredientsCount} ingredients</Text>
    </TouchableOpacity>
  );
};

export default RecipeCard;

// 🎨 Stilizimi bazik i kartës (ngjyrat mund t’i kalojmë më vonë në constants)
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: "#555",
  },
  category: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },
  ingredientsText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#8B4513", // ngjyrë kafe si në screenshot
  },
});
