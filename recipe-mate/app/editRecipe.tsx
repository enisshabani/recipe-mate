import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CreateRecipeModal() {
  const [recipe, setRecipe] = useState({
    name: '',
    category: '',
    time: '',
    servings: '',
    ingredients: '',
    instructions: ''
  });

  const handleSave = () => {
    if (!recipe.name.trim() || !recipe.ingredients.trim() || !recipe.instructions.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success!',
      'Recipe saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
    
    console.log('Saved recipe:', recipe);
  };

  const handleInputChange = (field: string, value: string) => {
    setRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return(
    
  );
};