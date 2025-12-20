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
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
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
      <Animated.View entering={FadeIn.duration(400)} style={styles.navbar}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.navButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fde3cf" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Recipe</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={styles.saveButton}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={24} color="#F8a91f" />
        </TouchableOpacity>
      </Animated.View>

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
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons name="restaurant-outline" size={20} color="#2e573a" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Recipe name"
              placeholderTextColor="#999"
              value={recipe.title}
              onChangeText={(t) => setRecipe({ ...recipe, title: t })}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons name="document-text-outline" size={20} color="#2e573a" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              value={recipe.description}
              onChangeText={(t) => setRecipe({ ...recipe, description: t })}
            />
          </Animated.View>

          <View style={styles.row}>
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.inputContainer, styles.halfInput]}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="time-outline" size={20} color="#2e573a" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Time (min)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={recipe.time}
                onChangeText={(t) => setRecipe({ ...recipe, time: t })}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(250).duration(500)} style={[styles.inputContainer, styles.halfInput]}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="people-outline" size={20} color="#2e573a" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Servings"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={recipe.servings}
                onChangeText={(t) => setRecipe({ ...recipe, servings: t })}
              />
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={22} color="#2e573a" />
              <Text style={styles.sectionTitle}>Ingredients</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter ingredients, one per line"
              placeholderTextColor="#999"
              multiline
              value={recipe.ingredients}
              onChangeText={(t) => setRecipe({ ...recipe, ingredients: t })}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="create-outline" size={22} color="#2e573a" />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter cooking instructions"
              placeholderTextColor="#999"
              multiline
              value={recipe.instructions}
              onChangeText={(t) => setRecipe({ ...recipe, instructions: t })}
            />
          </Animated.View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.stickyBar}>
        <TouchableOpacity 
          style={styles.stickyButton} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.stickyText}>Save Changes</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFCFB",
  },

  navbar: {
    backgroundColor: "#2e573a",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  navButton: {
    padding: 4,
  },

  saveButton: {
    padding: 4,
  },

  title: { 
    color: "#fde3cf", 
    fontSize: 20, 
    fontWeight: "700" 
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  inputIconContainer: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  halfInput: {
    flex: 1,
  },

  sectionContainer: {
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2e573a",
  },

  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
    paddingTop: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  stickyBar: {
    width: "100%",
    padding: 20,
    backgroundColor: "#FFFCFB",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  stickyButton: {
    backgroundColor: "#2e573a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  stickyText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
