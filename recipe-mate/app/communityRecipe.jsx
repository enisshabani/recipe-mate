import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useRecipes } from "../contexts/RecipeContext";

export default function CommunityRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToFavorites, isFavorite } = useRecipes();

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;

      const ref = doc(db, "recipes", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setRecipe({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fde3cf" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Recipe</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* MAIN CARD */}
      <View style={styles.mainCard}>
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.description ? (
          <Text style={styles.description}>{recipe.description}</Text>
        ) : null}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={22} color="#F8a91f" />
            <Text style={styles.statLabel}>Cooking Time</Text>
            <Text style={styles.statValue}>{recipe.time}</Text>
          </View>

          <View style={styles.stat}>
            <Ionicons name="people-outline" size={22} color="#F8a91f" />
            <Text style={styles.statLabel}>Servings</Text>
            <Text style={styles.statValue}>{recipe.servings}</Text>
          </View>

          <View style={styles.stat}>
            <Ionicons name="list-outline" size={22} color="#F8a91f" />
            <Text style={styles.statLabel}>Ingredients</Text>
            <Text style={styles.statValue}>
              {recipe.ingredients?.length || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* INGREDIENTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients?.map((ing, i) => (
          <Text key={i} style={styles.text}>• {ing}</Text>
        ))}
      </View>

      {/* INSTRUCTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.text}>{recipe.instructions}</Text>
      </View>

      {/* SAVE */}
      <TouchableOpacity
        style={styles.favButton}
        onPress={() => addToFavorites(recipe)}
        disabled={isFavorite(recipe.id)}
      >
        <Ionicons
          name={isFavorite(recipe.id) ? "heart" : "heart-outline"}
          size={22}
          color="#2e573a"
        />
        <Text style={styles.favText}>
          {isFavorite(recipe.id) ? "Saved to favourites" : "Save to favourites"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFCFB",
    },
  
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 38,
      paddingBottom: 18,
      paddingHorizontal: 20,
      backgroundColor: "#2e573a",
    },
  
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 24,
      fontWeight: "700",
      color: "#fde3cf",
    },
  
    mainCard: {
      margin: 16,
      backgroundColor: "#2e573a",
      borderRadius: 18,
      padding: 20,
    },
  
    title: {
      fontSize: 26,
      fontWeight: "800",
      color: "#fde3cf",
      textAlign: "center",
    },
  
    description: {
      marginTop: 6,
      fontSize: 14,
      color: "#fde3cf",
      textAlign: "center",
    },
  
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 22,
    },
  
    stat: {
      alignItems: "center",
      flex: 1,
    },
  
    statLabel: {
      fontSize: 12,
      color: "#F8a91f",
      marginTop: 4,
    },
  
    statValue: {
      fontSize: 14,
      fontWeight: "700",
      color: "#fff",
      marginTop: 2,
    },
  
    section: {
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: "#fff",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#2e573a",
      padding: 16,
    },
  
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#2e573a",
      marginBottom: 8,
    },
  
    text: {
      fontSize: 14,
      color: "#333",
      marginBottom: 4,
    },
  
    favButton: {
      margin: 16,
      backgroundColor: "#F8a91f",
      paddingVertical: 14,
      borderRadius: 50,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
  
    favText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#2e573a",
    },
  });
  