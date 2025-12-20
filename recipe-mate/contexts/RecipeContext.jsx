import React, { createContext, useContext, useState, useEffect, useCallback,useMemo,} from "react";
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
 /* ===========================
     HELPERS
     =========================== */

     const getFavoritesKey = useCallback(
      () => (user ? `favorites_${user.uid}` : "favorites_guest"),
      [user]
    );
  
      /* ===========================
     LOAD DATA
     =========================== */
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
          setFavoriteRecipes(Array.isArray(parsed) ? parsed : []);
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
  }, [user, getFavoritesKey]);

  const persistFavorites = useCallback(
    async (nextFavorites) => {
      try {
        const favKey = getFavoritesKey();
        await AsyncStorage.setItem(favKey, JSON.stringify(nextFavorites));
      } catch (err) {
        console.log("Error saving favorites:", err);
      }
    },
    [getFavoritesKey]
  );

  // ---------- CRUD per RECIPES (Firebase) ----------

  const addRecipe = useCallback( async (recipe) => {
    const id = await addRecipeToDb(recipe);
    const created = { id, ...recipe };
    setRecipes((prev) => [...prev, created]);
    return created;
  }, []);

  const updateRecipe = useCallback(async (id, updatedFields) => {
    await updateRecipeInDb(id, updatedFields);
    setRecipes((prev) =>
      prev.map((item) => 
      (item.id === id ? { ...item, ...updatedFields } : item))
    );
  }, []);

  const deleteRecipe =  useCallback(
    async (id) => {
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
    },
    [persistFavorites]
  );

/* ===========================
     FAVORITES
     =========================== */

  const addToFavorites = useCallback(
    async (recipe) => {
      if (!recipe || !recipe.id) return;

      setFavoriteRecipes((prev) => {
        const exists = prev.some((r) => r.id === recipe.id);
        if (exists) return prev;

        const next = [...prev, recipe];
        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites]
  );

  const removeFromFavorites = useCallback(
    async (id) => {
      setFavoriteRecipes((prev) => {
        const next = prev.filter((r) => r.id !== id);
        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites]
  );


  const isFavorite = useCallback(
    (id) => favoriteRecipes.some((r) => r.id === id),
    [favoriteRecipes]
  );

    /* ===========================
     DERIVED DATA (STATS)
     =========================== */

     const stats = useMemo(() => {
      const parseMinutes = (time) => {
        if (!time) return 0;
        const match = time.toString().match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
  
      return {
        totalRecipes: recipes.length,
        favoritesCount: favoriteRecipes.length,
        totalCookingTimeMinutes: favoriteRecipes.reduce(
          (sum, r) => sum + parseMinutes(r.time),
          0
        ),
      };
    }, [recipes, favoriteRecipes]);
  
    /* ===========================
       CONTEXT VALUE (MEMOIZED)
       =========================== */
  
    const value = useMemo(
      () => ({
        recipes,
        favoriteRecipes,
        loading,
  
        addRecipe,
        updateRecipe,
        deleteRecipe,
  
        addToFavorites,
        removeFromFavorites,
        isFavorite,
  
        stats,
      }),
      [
        recipes,
        favoriteRecipes,
        loading,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        stats,
      ]
    );
  
    return (
      <RecipeContext.Provider value={value}>
        {children}
      </RecipeContext.Provider>
    );
  };
