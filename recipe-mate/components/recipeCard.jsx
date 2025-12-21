import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRecipes } from "../contexts/RecipeContext";
import ConfirmModal from "./ConfirmModal";

function RecipeCard({ recipe, index = 0 }) {
  const router = useRouter();
  const { deleteRecipe } = useRecipes();

  const [modalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const confirmDelete = async () => {
    await deleteRecipe(recipe.id);
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500).springify()}
      style={[styles.card, animatedStyle]}
    >

      {/* EDIT */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/recipe",
            params: { currentRecipe: JSON.stringify(recipe) },
          })
        }
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.ingredientsText}>
          {recipe.ingredients.length} ingredients
        </Text>
      </TouchableOpacity>

      {/* DELETE */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={24} color="#8B0000" />
      </TouchableOpacity>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={modalVisible}
        type="error"
        showConfirm={true}
        message={`Delete "${recipe.title}"?`}
        onConfirm={confirmDelete}
        onClose={() => setModalVisible(false)}
      />

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F8a91f",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  ingredientsText: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
});

export default memo(RecipeCard);
