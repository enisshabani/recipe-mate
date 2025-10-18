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
} from "react-native";
import{ useRouter } from "expo-router";

export default function AddRecipeScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const router=useRouter();

  const handleSaveRecipe = () => {
    if (!recipeName || !ingredients || !instructions) {
      alert("Please fill all required fields!");
      return;
    }

    const recipe = {
  id: Date.now().toString(), // gjenerojmë ID unike
  title: recipeName,
  time: cookingTime ? `${cookingTime} min` : "", // nëse user s'jep, mos shfaq
  servings: servings || undefined,
  ingredients: ingredients.split("\n"),
};

// Dërgojmë recetën në Home përmes params
router.push({
  pathname: "/",
  params: { recipeData: JSON.stringify(recipe) },
});

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

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Recipe</Text>
          <TouchableOpacity style={styles.headerSave} onPress={handleSaveRecipe}>
            <Text style={styles.headerSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Details */}
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
            placeholder="Cooking Time"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={cookingTime}
            onChangeText={setCookingTime}
          />
          <TextInput
            placeholder="Servings"
            style={[styles.input, { flex: 1 }]}
            value={servings}
            onChangeText={setServings}
          />
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients *</Text>
        <Text style={styles.subText}>Enter each ingredient on a new line</Text>
        <TextInput
          placeholder="2 cups flour..."
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions *</Text>
        <TextInput
          placeholder="1.Mix dry ingredients..."
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />

        {/* Save Button */}
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
  backgroundColor: "#fdf8e7",
},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5c3d2e",
  },
  headerSave: {
    backgroundColor: "#b87333",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  headerSaveText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    color: "#5c3d2e",
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
    marginBottom: 10,
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
    backgroundColor: "#a65a2e",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});  
