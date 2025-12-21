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
  Image,
  Modal,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
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
    imageUri: null,
  });
  const [showImageModal, setShowImageModal] = useState(false);

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
        imageUri: r.imageUri || null,
      });
    } catch (e) {
      console.log("Error parsing recipe:", e);
    }
  }, [params.currentRecipe]);

  const sendUpdateNotification = async (recipeName) => {
    if (Platform.OS === "web") return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Recipe Updated!",
          body: `"${recipeName}" has been successfully updated.`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  };

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
      imageUri: recipe.imageUri,
    };

    await updateRecipe(recipe.id, updated);
    Alert.alert("Success", "Recipe updated!");
    sendUpdateNotification(recipe.title.trim());
    router.back();
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== "granted" || mediaStatus.status !== "granted") {
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
      base64: true,
    });

    if (!result.canceled && result.assets?.length) {
      const base64 = result.assets[0].base64;
      const imageBase64 = `data:image/jpeg;base64,${base64}`;
      setRecipe({ ...recipe, imageUri: imageBase64 });
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
      base64: true,
    });

    if (!result.canceled && result.assets?.length) {
      const base64 = result.assets[0].base64;
      const imageBase64 = `data:image/jpeg;base64,${base64}`;
      setRecipe({ ...recipe, imageUri: imageBase64 });
    }
  };

  const removeImage = () => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove the recipe image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setRecipe({ ...recipe, imageUri: null }),
        },
      ]
    );
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
              <Ionicons name="restaurant-outline" size={20} color="#F4A300" />
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
              <Ionicons name="document-text-outline" size={20} color="#F4A300" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              value={recipe.description}
              onChangeText={(t) => setRecipe({ ...recipe, description: t })}
            />
          </Animated.View>

          {/* Image Section */}
          <Animated.View entering={FadeInDown.delay(175).duration(500)} style={styles.imageSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="images-outline" size={22} color="#F4A300" />
              <Text style={styles.sectionTitle}>Recipe Image</Text>
            </View>
            
            {recipe.imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: recipe.imageUri }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={[styles.imageButton, styles.changeButton]}
                    onPress={() => Platform.OS === "web" ? pickImage() : setShowImageModal(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                    <Text style={styles.imageButtonText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.imageButton, styles.removeButton]}
                    onPress={removeImage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.imageButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() => Platform.OS === "web" ? pickImage() : setShowImageModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={32} color="#F4A300" />
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <View style={styles.row}>
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.inputContainer, styles.halfInput]}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="time-outline" size={20} color="#F4A300" />
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
                <Ionicons name="people-outline" size={20} color="#F4A300" />
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
              <Ionicons name="list-outline" size={22} color="#F4A300" />
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
              <Ionicons name="create-outline" size={22} color="#F4A300" />
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

      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Recipe Image</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="#F4A300" />
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={pickImage}
            >
              <Ionicons name="images" size={24} color="#F4A300" />
              <Text style={styles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCancelButton]} 
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderWidth: 2,
    borderColor: "#2e573a",
    marginBottom: 16,
    paddingHorizontal: 12,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
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
    borderWidth: 2,
    borderColor: "#2e573a",
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  imageSection: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2e573a",
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  imagePreviewContainer: {
    alignItems: "center",
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#2e573a",
  },

  imageActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },

  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  changeButton: {
    backgroundColor: "#2e573a",
  },

  removeButton: {
    backgroundColor: "#e74c3c",
  },

  addImageButton: {
    alignItems: "center",
    padding: 24,
    borderWidth: 2,
    borderColor: "#2e573a",
    borderRadius: 12,
    borderStyle: "dashed",
  },

  addImageText: {
    marginTop: 8,
    fontSize: 16,
    color: "#2e573a",
    fontWeight: "600",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e573a",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },

  modalButtonText: {
    fontSize: 16,
    color: "#2e573a",
    fontWeight: "600",
  },

  modalCancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  modalCancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },

  stickyBar: {
    width: "100%",
    padding: 20,
    backgroundColor: "#FFFCFB",
    borderTopWidth: 2,
    borderColor: "#2e573a",
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
