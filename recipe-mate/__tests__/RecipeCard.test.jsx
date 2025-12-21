import React from 'react';
import { render } from '@testing-library/react-native';
import RecipeCard from '../components/recipeCard';

// Mocking external dependencies (Mocking tests)
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../contexts/RecipeContext', () => ({
  useRecipes: () => ({
    deleteRecipe: jest.fn(),
  }),
}));

describe('RecipeCard', () => {
  const mockRecipe = {
    id: '123',
    title: 'Spaghetti Carbonara',
    imageUri: 'https://example.com/pasta.jpg',
    ingredients: ['pasta', 'eggs', 'bacon']
  };

  it('renders recipe details correctly', () => {
    const { getByText } = render(<RecipeCard recipe={mockRecipe} />);
    
    // Check if title is rendered
    expect(getByText('Spaghetti Carbonara')).toBeTruthy();
    
    // Check if ingredients count is rendered
    expect(getByText('3 ingredients')).toBeTruthy();
  });
});
