import React, { createContext, useContext, useState, useEffect } from "react";
import { addRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../firebase/recipe";
import { useAuth } from "./AuthContext";

const RecipeContext = createContext();
export const useRecipes = () => useContext(RecipeContext);


export const RecipeProvider = ({ children }) => {
const { user } = useAuth();
const [recipes, setRecipes] = useState([]);
const [loading, setLoading] = useState(true);

// Load recipes on app start
useEffect(() => {
  const loadData = async () => {
    // nese user sesht logu → ska receta personale
    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    try {
      // lexon veq recetat e user-it + API recipes
      const data = await getAllRecipes(user.uid);
      setRecipes(data);
    } catch (err) {
      console.log("Error loading recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [user]); 

// ADD RECIPE 
const addRecipeWrapper = async (recipe) => {
  const id = await addRecipe(recipe);
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




