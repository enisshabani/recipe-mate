import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useRecipes } from "../contexts/RecipeContext";


export default function FavoritesScreen() {
  const { favoriteRecipes } = useRecipes();
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/recipe",
          params: { currentRecipe: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.time ? (
        <Text style={styles.cardSubtitle}>{item.time}</Text>
      ) : null}
      <Text style={styles.cardSmall}>
        {item.ingredients ? `${item.ingredients.length} ingredients` : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>

      {favoriteRecipes.length === 0 ? (
        <Text style={styles.emptyText}>
          You don't have any favorite recipes yet.
        </Text>
      ) : (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCFB", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2e573a",
    marginBottom: 16,
  },
  emptyText: { fontSize: 16, color: "#666", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#F4A300",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#2e573a" },
  cardSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },
  cardSmall: { fontSize: 12, color: "#888", marginTop: 2 },
});
