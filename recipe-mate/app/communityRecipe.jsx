import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withSpring } from "react-native-reanimated";
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
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { addToFavorites, isFavorite, removeFromFavorites } = useRecipes();
  const heartScale = useSharedValue(1);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const favorite = recipe ? isFavorite(recipe.id) : false;


  const handleToggleFavorite = useCallback(() => {
    if (!recipe) return;
    heartScale.value = 1;
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 6, stiffness: 500 }),
      withSpring(1, { damping: 8, stiffness: 400 })
    );

    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  }, [recipe, favorite, addToFavorites, removeFromFavorites]);

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
        <ActivityIndicator size="large" color="#2e573a" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fde3cf" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* RECIPE IMAGE */}
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

      {/* MAIN CARD */}
      <Animated.View entering={FadeInDown.delay(100).duration(500).springify()} style={styles.mainCard}>
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.description ? (
          <Text style={styles.description}>{recipe.description}</Text>
        ) : null}

        <View style={styles.statsRow}>
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.stat}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={22} color="#F8a91f" />
            </View>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{recipe.time}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.stat}>
            <View style={styles.iconCircle}>
              <Ionicons name="people-outline" size={22} color="#F8a91f" />
            </View>
            <Text style={styles.statLabel}>Servings</Text>
            <Text style={styles.statValue}>{recipe.servings}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.stat}>
            <View style={styles.iconCircle}>
              <Ionicons name="list-outline" size={22} color="#F8a91f" />
            </View>
            <Text style={styles.statLabel}>Ingredients</Text>
            <Text style={styles.statValue}>
              {recipe.ingredients?.length || 0}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* INGREDIENTS */}
      <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list-outline" size={24} color="#2e573a" />
          <Text style={styles.sectionTitle}>Ingredients</Text>
        </View>
        {recipe.ingredients?.map((ing, i) => (
          <Animated.View 
            key={i} 
            entering={FadeInDown.delay(400 + i * 50).duration(400)}
            style={styles.ingredientItem}
          >
            <View style={styles.bulletPoint} />
            <Text style={styles.text}>{ing}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      {/* INSTRUCTIONS */}
      <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={24} color="#2e573a" />
          <Text style={styles.sectionTitle}>Instructions</Text>
        </View>
        <Text style={styles.instructionsText}>{recipe.instructions}</Text>
      </Animated.View>

      {/* SAVE */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)}>
        <TouchableOpacity
          style={[styles.favButton, isFavorite(recipe.id) && styles.favButtonActive]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Animated.View style={heartAnimatedStyle}>
            <Ionicons
              name={isFavorite(recipe.id) ? "heart" : "heart-outline"}
              size={22}
              color="#fff"
            />
          </Animated.View>
          <Text style={styles.favText}>
            {isFavorite(recipe.id) ? "Saved to Favorites" : "Save to Favorites"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

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
      backgroundColor: "#FFFCFB",
    },

    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: "#2e573a",
      fontWeight: "600",
    },

    emptyText: {
      marginTop: 16,
      fontSize: 18,
      color: "#666",
      fontWeight: "600",
    },
  
    header: {
      paddingTop: 50,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: "#2e573a",
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
  
    mainCard: {
      margin: 16,
      backgroundColor: "#2e573a",
      borderRadius: 20,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
  
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: "#fde3cf",
      textAlign: "center",
      marginBottom: 8,
    },
  
    description: {
      fontSize: 15,
      color: "#fde3cf",
      textAlign: "center",
      opacity: 0.9,
      lineHeight: 22,
    },
  
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
      gap: 12,
    },
  
    stat: {
      alignItems: "center",
      flex: 1,
    },

    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
  
    statLabel: {
      fontSize: 12,
      color: "#F8a91f",
      fontWeight: "600",
      marginBottom: 4,
    },
  
    statValue: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fde3cf",
    },
  
    section: {
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: "#fff",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#f0f0f0",
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 16,
    },
  
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#2e573a",
    },

    ingredientItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      gap: 12,
    },

    bulletPoint: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#F4A300",
    },
  
    text: {
      fontSize: 15,
      color: "#444",
      flex: 1,
      lineHeight: 22,
    },

    instructionsText: {
      fontSize: 15,
      color: "#555",
      lineHeight: 24,
    },
  
    favButton: {
      margin: 16,
      backgroundColor: "#F4A300",
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      shadowColor: "#F4A300",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    favButtonActive: {
      backgroundColor: "#2e573a",
    },
  
    favText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fff",
    },

    imageContainer: {
      width: "100%",
      height: 250,
      borderRadius: 18,
      overflow: "hidden",
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: "#2e573a",
      alignSelf: "center",
      maxWidth: "92%",
    },

    recipeImage: {
      width: "100%",
      height: "100%",
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
  