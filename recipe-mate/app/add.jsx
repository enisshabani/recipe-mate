import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRecipes } from "../contexts/RecipeContext";

export default function AddRecipeScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const router = useRouter();
  const { addRecipe } = useRecipes();

  const handleSaveRecipe = () => {
    if (!recipeName || !ingredients || !instructions) {
      Alert.alert(
        "Required Fields",
        "Please fill Recipe Name, Ingredients, and Instructions."
      );
      return;
    }

    const recipe = {
      id: Date.now().toString(),
      title: recipeName.trim(),
      description: description.trim(),
      time: cookingTime.trim() ? `${cookingTime.trim()} min` : "",
      servings: servings.trim() ? Number(servings.trim()) : undefined,
      ingredients: ingredients
        .trim()
        .split("\n")
        .filter((i) => i.trim() !== ""),
      instructions: instructions.trim(),
    };

    addRecipe(recipe);

    Alert.alert("Success", "Recipe added successfully!");
    setRecipeName("");
    setDescription("");
    setCookingTime("");
    setServings("");
    setIngredients("");
    setInstructions("");
    
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Recipe</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.sectionTitle}>Recipe Details</Text>
        <TextInput
          placeholder="Recipe Name *"
          placeholderTextColor="#999"
          style={styles.input}
          value={recipeName}
          onChangeText={setRecipeName}
        />
        <TextInput
          placeholder="Description (optional)"
          placeholderTextColor="#999"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Cooking Time (min)"
            placeholderTextColor="#999"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={cookingTime}
            onChangeText={setCookingTime}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Servings"
            placeholderTextColor="#999"
            style={[styles.input, { flex: 1 }]}
            value={servings}
            onChangeText={setServings}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.sectionTitle}>Ingredients *</Text>
        <Text style={styles.subText}>Enter each ingredient on a new line</Text>
        <TextInput
          placeholder="2 cups flour..."
          placeholderTextColor="#999"
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <Text style={styles.sectionTitle}>Instructions *</Text>
        <TextInput
          placeholder="1. Mix dry ingredients..."
          placeholderTextColor="#999"
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveRecipe}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#2e573a",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    color: "#2e573a",
  },
  subText: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#2e573a",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#2e573a",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
