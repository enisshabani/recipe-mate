import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
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
    if (params.currentRecipe) {
      const r = JSON.parse(params.currentRecipe);
      setRecipe({
        id: r.id,
        title: r.title,
        description: r.description || "",
        time: r.time ? r.time.replace(" min", "") : "",
        servings: String(r.servings || ""),
        ingredients: r.ingredients.join("\n"),
        instructions: r.instructions,
      });
    }
  }, [params]);

  const handleSave = async () => {
    if (!recipe.title.trim() || !recipe.ingredients.trim()) {
      Alert.alert("Missing fields", "Name, ingredients, instructions are required");
      return;
    }

    const updated = {
      title: recipe.title.trim(),
      description: recipe.description.trim(),
      time: recipe.time ? `${recipe.time.trim()} min` : "",
      servings: Number(recipe.servings),
      ingredients: recipe.ingredients.split("\n"),
      instructions: recipe.instructions.trim(),
    };

    await updateRecipe(recipe.id, updated);

    Alert.alert("Success", "Recipe updated!");
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Recipe</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Recipe name"
          value={recipe.title}
          onChangeText={(t) => setRecipe({ ...recipe, title: t })}
        />

        <TextInput
          style={styles.input}
          placeholder="Ingredients"
          value={recipe.ingredients}
          onChangeText={(t) => setRecipe({ ...recipe, ingredients: t })}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Instructions"
          value={recipe.instructions}
          onChangeText={(t) => setRecipe({ ...recipe, instructions: t })}
          multiline
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navbar: {
    backgroundColor: "#2e573a",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  save: { color: "#F8a91f", fontSize: 16, fontWeight: "700" },
  content: { padding: 16 },
  input: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
  },
});
