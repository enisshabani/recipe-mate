// app/add.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,

} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRecipes } from "../contexts/RecipeContext";
import { useAuth } from "../contexts/AuthContext";

export default function AddRecipeScreen() {
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);


  const [errorMessage, setErrorMessage] = useState("");
  const [timeError, setTimeError] = useState("");
  const [servingsError, setServingsError] = useState("");

  const router = useRouter();
  const { addRecipe } = useRecipes();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const sendSuccessNotification = async (recipeName) => {
    if (Platform.OS === "web") return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✅ Recipe Saved!",
          body: `"${recipeName}" has been added to your collection.`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };

  const requestPermissions = async () => {
  if (Platform.OS !== "web") {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraStatus.status !== "granted" ||
      mediaStatus.status !== "granted"
    ) {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and photo library permissions to add images."
      );
      return false;
    }
  }
  return true;
};

const pickImage = async () => {
  setShowImageModal(false);
  const ok = await requestPermissions();
  if (!ok) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets?.length) {
    setImageUri(result.assets[0].uri);
  }
};

const takePhoto = async () => {
  setShowImageModal(false);
  const ok = await requestPermissions();
  if (!ok) return;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets?.length) {
    setImageUri(result.assets[0].uri);
  }
};

const handleImagePicker = () => {
  Platform.OS === "web" ? pickImage() : setShowImageModal(true);
};


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
    sendSuccessNotification(nameTrimmed);

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
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fde3cf" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Recipe</Text>

        <View style={{ width: 80 }} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.wrapper}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Ionicons name="restaurant-outline" size={20} color="#2e573a" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Recipe Name"
            placeholderTextColor="#999"
            value={recipeName}
            onChangeText={(text) => {
              setRecipeName(text);
              setErrorMessage("");
            }}
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
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrorMessage("");
            }}
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
              value={cookingTime}
              onChangeText={(text) => {
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
          </Animated.View>
        </View>
        {timeError || servingsError ? (
          <Text style={styles.error}>{timeError || servingsError}</Text>
        ) : null}

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={22} color="#2e573a" />
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
          <TextInput
            style={[styles.textArea]}
            placeholder="Enter ingredients, one per line"
            placeholderTextColor="#999"
            multiline
            value={ingredients}
            onChangeText={(text) => {
              setIngredients(text);
              setErrorMessage("");
            }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={22} color="#2e573a" />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          <TextInput
            style={[styles.textArea]}
            placeholder="Enter cooking instructions"
            placeholderTextColor="#999"
            multiline
            value={instructions}
            onChangeText={(text) => {
              setInstructions(text);
              setErrorMessage("");
            }}
          />
        </Animated.View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <TouchableOpacity style={styles.button} onPress={handleSaveRecipe} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.buttonText}>Save Recipe</Text>
          </TouchableOpacity>
        </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFFCFB" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#2e573a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: "#fde3cf",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fde3cf",
    letterSpacing: 0.5,
  },
  wrapper: { 
    padding: 20,
    paddingBottom: 40,
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
    paddingVertical: 14,
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
  button: {
    backgroundColor: "#2e573a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 17 
  },
  error: {
    color: "#d9534f",
    marginBottom: 12,
    marginTop: -8,
    fontSize: 13,
    fontWeight: "600",
  },
});
