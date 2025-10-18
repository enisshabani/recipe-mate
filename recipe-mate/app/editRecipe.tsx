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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Details</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Recipe Name *"
            value={recipe.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholderTextColor="#999"
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Category"
              value={recipe.category}
              onChangeText={(text) => handleInputChange('category', text)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Time (e.g., 15 min)"
              value={recipe.time}
              onChangeText={(text) => handleInputChange('time', text)}
              placeholderTextColor="#999"
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Servings"
            value={recipe.servings}
            onChangeText={(text) => handleInputChange('servings', text)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ingredients
          </Text>
          <Text style={styles.subtitle}>Enter each ingredient on a new line</Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="2 cups flour... 
cup milk...
eggs..."
            value={recipe.ingredients}
            onChangeText={(text) => handleInputChange('ingredients', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Instructions
          </Text>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="1. Mix dry ingredients...
2. Add wet ingredients...
3. Cook until golden brown..."
            value={recipe.instructions}
            onChangeText={(text) => handleInputChange('instructions', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#F8F5F2",
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
    backgroundColor: "#8B4513",
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
    color: "#3B2F2F",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  halfInput: {
    flex: 1,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

});