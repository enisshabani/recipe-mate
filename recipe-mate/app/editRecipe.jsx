import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useRecipes } from '../contexts/RecipeContext';

export default function CreateRecipeModal() {
  const params = useLocalSearchParams();
  const { updateRecipe } = useRecipes();
  const [recipe, setRecipe] = useState({
    id: '',
    title: '',
    description: '',
    time: '',
    servings: '',
    ingredients: '',
    instructions: '',
    category: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const rawRecipe = params.currentRecipe;
    if (rawRecipe) {
      try {
        const currentRecipe = JSON.parse(String(rawRecipe));
        setRecipe({
          id: currentRecipe.id || '',
          title: currentRecipe.title || '',
          description: currentRecipe.description || '',
          category: currentRecipe.category || '',
          time: currentRecipe.time ? currentRecipe.time.replace(' min', '') : '',
          servings: String(currentRecipe.servings || ''),
          ingredients: Array.isArray(currentRecipe.ingredients)
            ? currentRecipe.ingredients.join('\n')
            : currentRecipe.ingredients || '',
          instructions: currentRecipe.instructions || '',
        });
        setIsEditMode(true);
      } catch (e) {
        console.error("Error parsing currentRecipe:", e);
        setRecipe({
          id: '',
          title: '',
          description: '',
          time: '',
          servings: '',
          ingredients: '',
          instructions: '',
          category: '',
        });
      }
    }
  }, [params.currentRecipe]);

  const handleSave = () => {
    if (!recipe.title.trim() || !recipe.ingredients.trim() || !recipe.instructions.trim()) {
      Alert.alert('Error', 'Please fill in Recipe Name, Ingredients, and Instructions');
      return;
    }

    const updatedRecipe = {
      id: recipe.id,
      title: recipe.title.trim(),
      description: recipe.description.trim(),
      category: recipe.category.trim(),
      time: recipe.time.trim() ? `${recipe.time.trim()} min` : '',
      servings: Number(recipe.servings) || undefined,
      ingredients: recipe.ingredients
        .trim()
        .split('\n')
        .filter(i => i.trim() !== ''),
      instructions: recipe.instructions.trim(),
    };

    updateRecipe(updatedRecipe);

    router.push('/');

    Alert.alert('Success!', 'Recipe updated successfully!');
  };

  const handleInputChange = (field, value) => {
    setRecipe(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.titleText}>
          {isEditMode ? 'Edit Recipe' : 'Create Recipe'}
        </Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Recipe Name *"
            value={recipe.title}
            onChangeText={text => handleInputChange('title', text)}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            value={recipe.description}
            onChangeText={text => handleInputChange('description', text)}
            placeholderTextColor="#999"
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Category"
              value={recipe.category}
              onChangeText={text => handleInputChange('category', text)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Time (e.g., 15)"
              value={recipe.time}
              onChangeText={text => handleInputChange('time', text)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Servings"
            value={recipe.servings}
            onChangeText={text => handleInputChange('servings', text)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients *</Text>
          <Text style={styles.subtitle}>Enter each ingredient on a new line</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={`2 cups flour...
1 cup milk...
3 eggs...`}
            value={recipe.ingredients}
            onChangeText={text => handleInputChange('ingredients', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions *</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={`1. Mix dry ingredients...
2. Add wet ingredients...
3. Cook until golden brown...`}
            value={recipe.instructions}
            onChangeText={text => handleInputChange('instructions', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F2',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2e573a',
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
    backgroundColor: '#F8a91f',
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
    color: '#fde3cf',
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
    shadowOffset: { width: 0, height: 1 },
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
