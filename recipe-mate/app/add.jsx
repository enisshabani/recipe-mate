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
import { useAuth } from "../contexts/AuthContext";

export default function AddRecipeScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const { user } = useAuth();

  const handleSaveRecipe = () => {
    if (!recipeName || !ingredients || !instructions) {
      Alert.alert("Required Fields", "Please fill Recipe Name, Ingredients, and Instructions.");
      return;
    }

    const recipe = {
      title: recipeName.trim(),
      description: description.trim(),
      time: cookingTime.trim() ? `${cookingTime.trim()} min` : "",
      servings: servings.trim() ? Number(servings.trim()) : undefined,
      ingredients: ingredients
        .trim()
        .split("\n")
        .filter((i) => i.trim() !== ""),
      instructions: instructions.trim(),
      userId: user?.uid,     // lidh receta me user
      type: "manual",       
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
      
      {/* HEADER ME BUTON MBRAPA */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#2e573a" />
        </TouchableOpacity>
  
        <Text style={styles.headerTitle}>Add Recipe</Text>
  
        {/* vend i zbrazët për ta balancuar headerin */}
        <View style={{ width: 28 }} />
      </View>
  
      <ScrollView contentContainerStyle={styles.wrapper}>
        
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={recipeName}
          onChangeText={setRecipeName}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Cooking Time (min)"
          keyboardType="numeric"
          value={cookingTime}
          onChangeText={setCookingTime}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Servings"
          keyboardType="numeric"
          value={servings}
          onChangeText={setServings}
        />
  
        <TextInput
          style={[styles.input, styles.multi]}
          placeholder="Ingredients (one per line)"
          multiline
          value={ingredients}
          onChangeText={setIngredients}
        />
  
        <TextInput
          style={[styles.input, styles.multi]}
          placeholder="Instructions"
          multiline
          value={instructions}
          onChangeText={setInstructions}
        />
  
        <TouchableOpacity style={styles.button} onPress={handleSaveRecipe}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
  
      </ScrollView>
    </SafeAreaView>
  );
  
 }
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCFB" },
  wrapper: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#2e573a" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  multi: { height: 120, textAlignVertical: "top" },
  button: {
    backgroundColor: "#2e573a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#FFFCFB",
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e573a",
  },
  
 });
 