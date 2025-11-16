import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addRecipe as addRecipeToDb,
  getAllRecipes,
  updateRecipe as updateRecipeInDb,
  deleteRecipe as deleteRecipeFromDb,
} from "../firebase/recipe";
import { useAuth } from "./AuthContext";

const RecipeContext = createContext();
export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const { user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFavoritesKey = () => (user ? `favorites_${user.uid}` : "favorites_guest");

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setRecipes([]);
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }

      try {
      
        const data = await getAllRecipes(user.uid);
        setRecipes(data);

      
        const favKey = getFavoritesKey();
        const stored = await AsyncStorage.getItem(favKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavoriteRecipes(parsed);
          } else {
            setFavoriteRecipes([]);
          }
        } else {
          setFavoriteRecipes([]);
        }
      } catch (err) {
        console.log("Error loading recipes/favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
  }, [user]);

  const persistFavorites = async (nextFavorites) => {
    try {
      const favKey = getFavoritesKey();
      await AsyncStorage.setItem(favKey, JSON.stringify(nextFavorites));
    } catch (err) {
      console.log("Error saving favorites:", err);
    }
  };

  // ---------- CRUD për RECIPES (Firebase) ----------

  const addRecipe = async (recipe) => {
    const id = await addRecipeToDb(recipe);
    const created = { id, ...recipe };
    setRecipes((prev) => [...prev, created]);
    return created;
  };

  const updateRecipe = async (id, updatedFields) => {
    await updateRecipeInDb(id, updatedFields);
    setRecipes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteRecipe = async (id) => {
    try {
      await deleteRecipeFromDb(id);
      setRecipes((prev) => prev.filter((item) => item.id !== id));

      setFavoriteRecipes((prev) => {
        const next = prev.filter((r) => r.id !== id);
        persistFavorites(next);
        return next;
      });
    } catch (err) {
      console.log("Error deleting recipe:", err);
    }
  };


  const addToFavorites = async (recipe) => {
    if (!recipe || !recipe.id) return;

    setFavoriteRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) return prev;

      const next = [...prev, recipe];
      persistFavorites(next);
      return next;
    });
  };

  const removeFromFavorites = async (id) => {
    setFavoriteRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistFavorites(next);
      return next;
    });
  };

  const isFavorite = (id) => {
    if (!id) return false;
    return favoriteRecipes.some((r) => r.id === id);
  };


  const parseMinutes = (time) => {
    if (!time) return 0;
    const match = time.toString().match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const totalRecipes = recipes.length;
  const favoritesCount = favoriteRecipes.length;
  const totalCookingTimeMinutes = favoriteRecipes.reduce(
    (sum, r) => sum + parseMinutes(r.time),
    0
  );

  const value = {
    recipes,
    favoriteRecipes,
    loading,

    // CRUD
    addRecipe,
    updateRecipe,
    deleteRecipe,

    // favorites
    addToFavorites,
    removeFromFavorites,
    isFavorite,

    // stats
    stats: {
      totalRecipes,
      favoritesCount,
      totalCookingTimeMinutes,
    },
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};
