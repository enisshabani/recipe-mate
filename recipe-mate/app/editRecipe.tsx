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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      <View style={styles.navbar}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.titleText}>Edit Recipe</Text>
      
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 45,
  },
  
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },

});