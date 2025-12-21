import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRecipes } from "../contexts/RecipeContext";

export default function MealDetails() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const router = useRouter();
  const { addRecipe, addToFavorites, isFavorite, removeFromFavorites, recipes } =
    useRecipes();

  const heartScale = useSharedValue(1);
  const saveScale = useSharedValue(1);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

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

  // Check if recipe is already saved
  useEffect(() => {
    if (meal && recipes) {
      const saved = recipes.some(recipe => recipe.id === meal.idMeal || recipe.title === meal.strMeal);
      setIsSaved(saved);
    }
  }, [meal, recipes]);

  if (!meal) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e573a" />
        <Text style={styles.loading}>Loading recipe...</Text>
      </View>
    );
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
    if (isSaved) {
      // Unsave/Remove the recipe
      // Since we don't have a removeRecipe function, we'll just update the state
      // You may need to implement removeRecipe in RecipeContext
      setIsSaved(false);
    } else {
      // Save the recipe
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
      setIsSaved(true);
      
      // Navigate to homepage after a short delay only when saving
      setTimeout(() => {
        router.push("/");
      }, 500);
    }
  };

  const handleToggleFavorite = () => {
    // Reset and trigger bounce animation
    heartScale.value = 1;
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 6, stiffness: 500 }),
      withSpring(1, { damping: 8, stiffness: 400 })
    );

    if (favorite) {
      removeFromFavorites(normalizedRecipe.id);
    } else {
      addToFavorites(normalizedRecipe);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFCFB" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fde3cf" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Image with animation */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => setShowImagePreview(true)}
        >
          <Animated.View 
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.imageContainer}
          >
            <Image 
              source={{ 
                uri: meal.strMealThumb,
                cache: 'force-cache'
              }} 
              style={styles.image}
              resizeMode="cover"
              defaultSource={require('../assets/images/react-logo.png')}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Title and Category */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.titleContainer}>
          <Text style={styles.title}>{meal.strMeal}</Text>
          <View style={styles.categoryBadge}>
            <Ionicons name="restaurant-outline" size={16} color="#2e573a" />
            <Text style={styles.category}>{meal.strCategory}</Text>
          </View>
        </Animated.View>

        {/* Info Cards */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.infoRow}>
          <View style={styles.infoBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={24} color="#F4A300" />
            </View>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoText}>{cookingTime}</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="people-outline" size={24} color="#F4A300" />
            </View>
            <Text style={styles.infoLabel}>Servings</Text>
            <Text style={styles.infoText}>{servings}</Text>
          </View>
        </Animated.View>

        {/* Ingredients Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={24} color="#2e573a" />
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
          <View style={styles.ingredientsContainer}>
            {ingredients.map((item, index) => (
              <Animated.View 
                key={index} 
                entering={FadeInDown.delay(500 + index * 50).duration(400)}
                style={styles.ingredientItem}
              >
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredient}>{item}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Instructions Section */}
        {meal.strInstructions && (
          <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={24} color="#2e573a" />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            <Text style={styles.instructions}>{meal.strInstructions}</Text>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, isSaved ? styles.savedButton : styles.secondaryButton]}
          onPress={handleSaveToMyRecipes}
          activeOpacity={0.8}
        >
          <Animated.View style={saveAnimatedStyle}>
            <Ionicons 
              name={isSaved ? "remove-circle-outline" : "add-circle-outline"} 
              size={20} 
              color="#fde3cf" 
            />
          </Animated.View>
          <Text style={styles.actionButtonText}>
            {isSaved ? "Unsave Recipe" : "Save Recipe"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.favoriteButton]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Animated.View style={heartAnimatedStyle}>
            <Ionicons 
              name={favorite ? "heart" : "heart-outline"} 
              size={20} 
              color="#fff" 
            />
          </Animated.View>
          <Text style={styles.actionButtonText}>
            {favorite ? "Favorited" : "Favorite"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Image Preview Modal */}
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
                source={{ uri: meal.strMealThumb }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFCFB",
  },

  loading: {
    marginTop: 16,
    fontSize: 16,
    color: "#2e573a",
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFCFB",
  },

  header: {
    backgroundColor: "#2e573a",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  backText: {
    fontSize: 18,
    color: "#fde3cf",
    fontWeight: "600",
  },

  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    borderWidth: 2,
    borderColor: "#2e573a",
    alignSelf: "center",
    maxWidth: "92%",
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
  },

  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2e573a",
    marginBottom: 8,
    lineHeight: 34,
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  category: {
    fontSize: 14,
    color: "#2e573a",
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF4D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    fontWeight: "500",
  },

  infoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e573a",
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e573a",
  },

  ingredientsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },

  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F4A300",
  },

  ingredient: {
    fontSize: 15,
    color: "#444",
    flex: 1,
    lineHeight: 22,
  },

  instructions: {
    fontSize: 15,
    lineHeight: 24,
    color: "#555",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  stickyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "#FFFCFB",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#F4A300",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  secondaryButton: {
    backgroundColor: "#2e573a",
  },

  savedButton: {
    backgroundColor: "#d9534f",
  },

  favoriteButton: {
    backgroundColor: "#F4A300",
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

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
