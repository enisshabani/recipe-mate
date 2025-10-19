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

export default function AddRecipeScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const router = useRouter();

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

    router.push({
      pathname: "/",
      params: { recipeData: JSON.stringify(recipe) },
    });

    Alert.alert("Success", "Recipe added successfully!");
    setRecipeName("");
    setDescription("");
    setCookingTime("");
    setServings("");
    setIngredients("");
    setInstructions("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Recipe</Text>
          <TouchableOpacity style={styles.headerSave} onPress={handleSaveRecipe}>
            <Text style={styles.headerSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recipe Details</Text>
        <TextInput
          placeholder="Recipe Name *"
          style={styles.input}
          value={recipeName}
          onChangeText={setRecipeName}
        />
        <TextInput
          placeholder="Description (optional)"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Cooking Time (min)"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={cookingTime}
            onChangeText={setCookingTime}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Servings"
            style={[styles.input, { flex: 1 }]}
            value={servings}
            onChangeText={setServings}
            keyboardType="numeric"
          />
        </View>

\        <Text style={styles.sectionTitle}>Ingredients *</Text>
        <Text style={styles.subText}>Enter each ingredient on a new line</Text>
        <TextInput
          placeholder="2 cups flour..."
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        <Text style={styles.sectionTitle}>Instructions *</Text>
        <TextInput
          placeholder="1. Mix dry ingredients..."
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
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
    paddingTop: 35,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4A300",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 22,
    color: "#333",
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e573a",
  },
  headerSave: {
    backgroundColor: "#F4A300",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  headerSaveText: {
    color: "#2e573a",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    color: "#2e573a",
  },
  subText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#F4A300",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 16,
  },
});
