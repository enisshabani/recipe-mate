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
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecipeScreen() {
  const router = useRouter();
  const { name, cookingTime, servings, ingredients, instructions } =
    useLocalSearchParams();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadFavorite = async () => {
      try {
        const value = await AsyncStorage.getItem(`favorite_${name}`);
        if (value === "true") setIsFavorite(true);
      } catch {}
    };
    loadFavorite();
  }, [name]);

  const toggleFavorite = async () => {
    try {
      const newValue = !isFavorite;
      setIsFavorite(newValue);
      await AsyncStorage.setItem(`favorite_${name}`, newValue.toString());
    } catch {}
  };

  const handleDelete = () => {
    Alert.alert("Delete Recipe", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(`favorite_${name}`);
          } catch {}
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Recipe",
          headerStyle: { backgroundColor: "#CA91A1" },
          headerTintColor: "#F8F5F4",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "700",
            color: "#F8F5F4",
          },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="chevron-back" size={24} color="#F8F5F4" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/editRecipe?name=${name}`)}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="create-outline" size={22} color="#F8F5F4" />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          <Text style={styles.recipeTitle}>{name || "Pancake"}</Text>
          <Text style={styles.optionalText}>Opt</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" color="#CA91A1" size={26} />
              <Text style={styles.infoLabel}>Cooking Time</Text>
              <Text style={styles.infoValue}>{cookingTime || "15 min"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="people-outline" color="#CA91A1" size={26} />
              <Text style={styles.infoLabel}>Servings</Text>
              <Text style={styles.infoValue}>{servings || "2"}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="list-outline" color="#CA91A1" size={26} />
              <Text style={styles.infoLabel}>Ingredients</Text>
              <Text style={styles.infoValue}>1</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingredients</Text>
          <Text style={styles.ingredientText}>
            {ingredients || "2 cups flour..."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            {instructions || "Mix and fry."}
          </Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EADFD8" },
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
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
