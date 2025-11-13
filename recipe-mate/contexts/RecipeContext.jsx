import React, { createContext, useContext, useState, useEffect } from "react";
import { addRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../firebase/recipe";

const RecipeContext = createContext();

export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
const [recipes, setRecipes] = useState([]);
const [loading, setLoading] = useState(true);

// Load recipes on app start
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (err) {
      console.log("Error loading recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

// ADD RECIPE (from search meal or user)
const addRecipeWrapper = async (recipe) => {
  /**
   recipe expected structure:
   {
     title: string,
     image: string,
     ingredients: array of strings,
     category: string (optional)
   }
  */

  const id = await addRecipe(recipe);  // Firebase returns the document ID

  // Save locally in state
  setRecipes((prev) => [...prev, { id, ...recipe }]);
};

// UPDATE RECIPE
const updateRecipeWrapper = async (id, updatedFields) => {
  await updateRecipe(id, updatedFields);
  setRecipes((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    )
  );
};

// DELETE RECIPE
const deleteRecipeWrapper = async (id) => {
  try {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((item) => item.id !== id));
  } catch (err) {
    console.log("Error deleting:", err);
  }
};

return (
  <RecipeContext.Provider
    value={{
      recipes,
      loading,
      addRecipe: addRecipeWrapper,
      updateRecipe: updateRecipeWrapper,
      deleteRecipe: deleteRecipeWrapper,
    }}
  >
    {children}
  </RecipeContext.Provider>
);
};




