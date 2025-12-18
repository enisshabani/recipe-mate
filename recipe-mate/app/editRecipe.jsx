import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRecipes } from "../contexts/RecipeContext";

export default function EditRecipe() {
  const params = useLocalSearchParams();
  const { updateRecipe } = useRecipes();

  const [recipe, setRecipe] = useState({
    id: "",
    title: "",
    description: "",
    time: "",
    servings: "",
    ingredients: "",
    instructions: "",
  });

  useEffect(() => {
    if (!params.currentRecipe) return;

    try {
      const r = JSON.parse(params.currentRecipe);

      setRecipe({
        id: r.id,
        title: r.title || "",
        description: r.description || "",
        time:
          typeof r.time === "string"
            ? r.time.replace(" min", "")
            : r.time?.toString() || "",
        servings: r.servings ? String(r.servings) : "",
        ingredients: Array.isArray(r.ingredients)
          ? r.ingredients.join("\n")
          : r.ingredients || "",
        instructions: r.instructions || "",
      });
    } catch (e) {
      console.log("Error parsing recipe:", e);
    }
  }, [params.currentRecipe]);

  const handleSave = async () => {
    if (!recipe.title.trim() || !recipe.ingredients.trim()) {
      Alert.alert("Missing fields", "Name, ingredients and instructions are required.");
      return;
    }

    const updated = {
      title: recipe.title.trim(),
      description: recipe.description.trim(),
      time: recipe.time ? `${recipe.time.trim()} min` : "",
      servings: recipe.servings ? Number(recipe.servings) : null,
      ingredients: recipe.ingredients
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
      instructions: recipe.instructions.trim(),
    };

    await updateRecipe(recipe.id, updated);
    Alert.alert("Success", "Recipe updated!");
    router.back();
  };

  return (
    <View style={styles.page}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Recipe</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Recipe name"
            value={recipe.title}
            onChangeText={(t) => setRecipe({ ...recipe, title: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={recipe.description}
            onChangeText={(t) => setRecipe({ ...recipe, description: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Cooking time (minutes)"
            keyboardType="numeric"
            value={recipe.time}
            onChangeText={(t) => setRecipe({ ...recipe, time: t })}
          />

          <TextInput
            style={styles.input}
            placeholder="Servings"
            keyboardType="numeric"
            value={recipe.servings}
            onChangeText={(t) => setRecipe({ ...recipe, servings: t })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ingredients (one per line)"
            multiline
            value={recipe.ingredients}
            onChangeText={(t) => setRecipe({ ...recipe, ingredients: t })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Instructions"
            multiline
            value={recipe.instructions}
            onChangeText={(t) => setRecipe({ ...recipe, instructions: t })}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.stickyBar}>
        <TouchableOpacity style={styles.stickyButton} onPress={handleSave}>
          <Text style={styles.stickyText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },

  navbar: {
    backgroundColor: "#2e573a",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { color: "#fde3cf", fontSize: 20, fontWeight: "700" },
  save: { color: "#F8a91f", fontSize: 16, fontWeight: "700" },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 16,
  },

  input: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
  },

  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  stickyBar: {
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  stickyButton: {
    backgroundColor: "#F8a91f",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  stickyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
