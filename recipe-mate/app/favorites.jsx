import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRecipes } from "../contexts/RecipeContext";

export default function FavoritesScreen() {
  const { favoriteRecipes } = useRecipes();
  const router = useRouter();

  const renderItem = useCallback(({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/recipe",
            params: { currentRecipe: JSON.stringify(item) },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <Ionicons name="heart" size={24} color="#8B0000" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.time ? <Text style={styles.cardSubtitle}>{item.time}</Text> : null}
            <Text style={styles.cardSmall}>
              {item.ingredients ? `${item.ingredients.length} ingredients` : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ), [router]);

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="#2e573a" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Favorites</Text>

      {favoriteRecipes.length === 0 ? (
        <Animated.View entering={FadeIn.duration(600)} style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Start adding recipes to your favorites!
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          updateCellsBatchingPeriod={50}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCFB" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: "#2e573a",
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e573a",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e573a",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: { 
    fontSize: 15, 
    color: "#666", 
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F8a91f",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#222",
    marginBottom: 4,
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: "#666", 
    marginBottom: 4,
  },
  cardSmall: { 
    fontSize: 13, 
    color: "#888",
  },
});
