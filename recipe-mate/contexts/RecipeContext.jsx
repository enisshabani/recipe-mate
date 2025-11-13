import React, { createContext, useContext, useState, useEffect } from "react";
import { addRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../firebase/recipe";

const RecipeContext = createContext();

export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ngarko recetat një herë në start
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

  // wrapper për CRUD
  const addRecipeWrapper = async (recipe) => {
    const id = await addRecipe(recipe);
    setRecipes((prev) => [...prev, { id, ...recipe }]);
  };

  const updateRecipeWrapper = async (id, updatedFields) => {
    await updateRecipe(id, updatedFields);
    setRecipes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteRecipeWrapper = async (id) => {
    try {
      await deleteRecipe(id);
  
      // largojmë recetën nga state
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
