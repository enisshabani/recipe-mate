import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInRight, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Notifications from "expo-notifications";
import { useRecipes } from "../contexts/RecipeContext";

export default function RecipeScreen() {
  const router = useRouter();
  const { currentRecipe } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const favoriteScale = useSharedValue(1);

  const {
    deleteRecipe,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useRecipes();

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

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

  const sendFavoriteNotification = async (recipeName, isAdding) => {
    if (Platform.OS === "web") return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: isAdding ? "Added to Favorites!" : "Removed from Favorites",
          body: `"${recipeName}" has been ${isAdding ? "added to" : "removed from"} your favorites.`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };

  const sendDeleteNotification = async (recipeName) => {
    if (Platform.OS === "web") return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🗑️ Recipe Deleted",
          body: `"${recipeName}" has been removed from your collection.`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };

  const handleToggleFavorite = () => {
    if (!recipe) return;
    favoriteScale.value = withSpring(1.3, { damping: 10 }, () => {
      favoriteScale.value = withSpring(1);
    });
    const isCurrentlyFavorite = isFavorite(recipe.id);
    if (isCurrentlyFavorite) {
      removeFromFavorites(recipe.id);
      sendFavoriteNotification(recipe.title, false);
    } else {
      addToFavorites(recipe);
      sendFavoriteNotification(recipe.title, true);
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
              const recipeName = recipe.title;
              deleteRecipe(recipe.id);
              sendDeleteNotification(recipeName);
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
          <Ionicons name="chevron-back" size={28} color="#fde3cf" />
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
          <Ionicons name="create-outline" size={26} color="#fde3cf" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {recipe.imageUri && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setShowImagePreview(true)}
          >
            <Animated.View entering={FadeIn.duration(400)} style={styles.imageContainer}>
              <Image source={{ uri: recipe.imageUri }} style={styles.recipeImage} resizeMode="cover" />
            </Animated.View>
          </TouchableOpacity>
        )}

        <Animated.View entering={FadeIn.duration(500)} style={styles.mainCard}>
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
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
          <Text style={styles.cardTitle}>Ingredients</Text>
          <Text style={styles.ingredientText}>
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join("\n")
              : recipe.ingredients}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.card}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <Text style={styles.instructionText}>{recipe.instructions}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.bottomRow}>
          <Pressable style={[styles.favoriteButton, favoriteAnimatedStyle]} onPress={handleToggleFavorite}>
            <Animated.View style={favoriteAnimatedStyle}>
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                color="#2e573a"
                size={18}
              />
            </Animated.View>
            <Text style={styles.favoriteText}>
              {favorite ? "Remove Favorite" : "Add to Favorites"}
            </Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" color="#2e573a" size={18} />
            <Text style={styles.deleteButtonText}>Delete Recipe</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Image Preview Modal */}
      {recipe.imageUri && (
        <Modal
          visible={showImagePreview}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImagePreview(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowImagePreview(false)}
            >
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: recipe.imageUri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowImagePreview(false)}
                >
                  <Ionicons name="close-circle" size={40} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 38,
    backgroundColor: "#2e573a",
    borderBottomWidth: 1,
    borderBottomColor: "#2e573a",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fde3cf",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  headerRight: { padding: 4 },
  contentContainer: { padding: 16 },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#2e573a",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
