import React, { createContext, useState, useContext } from 'react';

const RecipeContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([
    {
      id: "1",
      title: "Spaghetti",
      time: "15 min",
      servings: 2,
      ingredients: ["Pasta", "Tomato", "Oil"],
      instructions: "Boil pasta and mix with sauce.",
      description: "A simple Italian classic.",
    },
  ]);

  const addRecipe = (recipe) => {
    setRecipes((prev) => [...prev, recipe]);
  };

  const updateRecipe = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  const deleteRecipe = (recipeId) => {
    if (recipeId === "1") {
      return;
    }
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
