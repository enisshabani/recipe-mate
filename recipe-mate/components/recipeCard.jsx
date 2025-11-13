import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRecipes } from "../contexts/RecipeContext";
import ConfirmModal from "./ConfirmModal";

export default function RecipeCard({ recipe }) {
  const router = useRouter();
  const { deleteRecipe } = useRecipes();

  const [modalVisible, setModalVisible] = useState(false);

  const confirmDelete = async () => {
    await deleteRecipe(recipe.id);
  };

  return (
    <View style={styles.card}>

      {/* EDIT */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/recipe",
            params: { currentRecipe: JSON.stringify(recipe) },
          })
        }
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

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F8a91f",
    flexDirection: "row",
    alignItems: "center",
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
