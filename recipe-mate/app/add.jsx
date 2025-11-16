// app/add.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
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

  const [errorMessage, setErrorMessage] = useState("");
  const [timeError, setTimeError] = useState("");
  const [servingsError, setServingsError] = useState("");

  const router = useRouter();
  const { addRecipe } = useRecipes();
  const { user } = useAuth();

  const handleSaveRecipe = () => {
    // reset error-at globale
    setErrorMessage("");

    const nameTrimmed = recipeName.trim();
    const descTrimmed = description.trim();
    const timeTrimmed = cookingTime.trim();
    const servingsTrimmed = servings.trim();
    const ingredientsTrimmed = ingredients.trim();
    const instructionsTrimmed = instructions.trim();

    // 1) Kontrollo që të gjitha fushat janë të mbushura
    if (
      !nameTrimmed ||
      !descTrimmed ||
      !timeTrimmed ||
      !servingsTrimmed ||
      !ingredientsTrimmed ||
      !instructionsTrimmed
    ) {
      const msg = "Please fill in all fields.";
      setErrorMessage(msg);
      Alert.alert("Missing fields", msg);
      return;
    }

    // 2) Cooking Time duhet të jetë numër
    if (!/^\d+$/.test(timeTrimmed)) {
      const msg = "Cooking time must be numeric.";
      setTimeError(msg);
      Alert.alert("Invalid Cooking Time", msg);
      return;
    }

    // 3) Servings duhet të jetë numër
    if (!/^\d+$/.test(servingsTrimmed)) {
      const msg = "Servings must be numeric.";
      setServingsError(msg);
      Alert.alert("Invalid Servings", msg);
      return;
    }

    const recipe = {
      title: nameTrimmed,
      description: descTrimmed,
      time: `${timeTrimmed} min`,
      servings: Number(servingsTrimmed),
      ingredients: ingredientsTrimmed
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i !== ""),
      instructions: instructionsTrimmed,
      userId: user?.uid,
      type: "manual",
    };

    addRecipe(recipe);
    Alert.alert("Success", "Recipe added successfully!");

    // reset formën
    setRecipeName("");
    setDescription("");
    setCookingTime("");
    setServings("");
    setIngredients("");
    setInstructions("");
    setErrorMessage("");
    setTimeError("");
    setServingsError("");

    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#2e573a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Recipe</Text>

        {/* bosh që të balancohet header-i */}
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.wrapper}>
        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          placeholderTextColor="#666"
          value={recipeName}
          onChangeText={(text) => {
            setRecipeName(text);
            setErrorMessage("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#666"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setErrorMessage("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Cooking Time (min)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={cookingTime}
          onChangeText={(text) => {
            // lejo vetëm numra
            const onlyDigits = text.replace(/[^0-9]/g, "");
            if (text !== onlyDigits) {
              setTimeError("Cooking time must contain numbers only.");
            } else {
              setTimeError("");
            }
            setCookingTime(onlyDigits);
            setErrorMessage("");
          }}
        />
        {timeError ? <Text style={styles.error}>{timeError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Servings"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={servings}
          onChangeText={(text) => {
            const onlyDigits = text.replace(/[^0-9]/g, "");
            if (text !== onlyDigits) {
              setServingsError("Servings must be numeric.");
            } else {
              setServingsError("");
            }
            setServings(onlyDigits);
            setErrorMessage("");
          }}
        />
        {servingsError ? <Text style={styles.error}>{servingsError}</Text> : null}

        <TextInput
          style={[styles.input, styles.multi]}
          placeholder="Ingredients (one per line)"
          placeholderTextColor="#666"
          multiline
          value={ingredients}
          onChangeText={(text) => {
            setIngredients(text);
            setErrorMessage("");
          }}
        />

        <TextInput
          style={[styles.input, styles.multi]}
          placeholder="Instructions"
          placeholderTextColor="#666"
          multiline
          value={instructions}
          onChangeText={(text) => {
            setInstructions(text);
            setErrorMessage("");
          }}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

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
  wrapper: { padding: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  multi: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2e573a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  error: {
    color: "red",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
