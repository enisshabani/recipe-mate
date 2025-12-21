import {
 collection,
 addDoc,
 getDocs,
 doc,
 updateDoc,
 deleteDoc,
 query,
 where,
} from "firebase/firestore";
import { db } from "./firebase";


export const addRecipe = async (recipe) => {
 try {
   const recipeToSave = {
     title: recipe.title?.trim() || "",
     description: recipe.description?.trim() || "",
     time: recipe.time?.toString().trim() || "",
     servings: Number(recipe.servings || 1),
     ingredients: Array.isArray(recipe.ingredients)
       ? recipe.ingredients
       : [],
     instructions: recipe.instructions?.trim() || "",
     imageUri: recipe.imageUri || null,
     userId: recipe.userId || null, 
     type: recipe.type || "manual",  
   };

   const docRef = await addDoc(collection(db, "recipes"), recipeToSave);
   return docRef.id;
 } catch (error) {
   console.error("Error adding recipe:", error);
   throw error;
 }
};


export const getAllRecipes = async (userId) => {
  try {
    if (!userId) return [];

    const recipes = [];

    const qUser = query(
      collection(db, "recipes"),
      where("userId", "==", userId)
    );
    const userSnap = await getDocs(qUser);
    userSnap.forEach((docSnap) =>
      recipes.push({ id: docSnap.id, ...docSnap.data() })
    );

    const qApi = query(
      collection(db, "recipes"),
      where("userId", "==", null) 
    );
    const apiSnap = await getDocs(qApi);
    apiSnap.forEach((docSnap) =>
      recipes.push({ id: docSnap.id, ...docSnap.data() })
    );

    return recipes;
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw error;
  }
};

export const updateRecipe = async (id, updatedFields) => {
 try {
   const recipeRef = doc(db, "recipes", id);

   const safeUpdate = {
     ...(updatedFields.title !== undefined && {
       title: updatedFields.title?.trim() || "",
     }),
     ...(updatedFields.description !== undefined && {
       description: updatedFields.description?.trim() || "",
     }),
     ...(updatedFields.time !== undefined && {
       time: updatedFields.time?.toString().trim() || "",
     }),
     ...(updatedFields.servings !== undefined && {
       servings: Number(updatedFields.servings || 1),
     }),
     ...(updatedFields.ingredients !== undefined && {
       ingredients: Array.isArray(updatedFields.ingredients)
         ? updatedFields.ingredients
         : [],
     }),
     ...(updatedFields.instructions !== undefined && {
       instructions: updatedFields.instructions?.trim() || "",
     }),
     ...(updatedFields.imageUri !== undefined && {
       imageUri: updatedFields.imageUri || null,
     }),
   };

   await updateDoc(recipeRef, safeUpdate);
 } catch (error) {
   console.error("Error updating recipe:", error);
   throw error;
 }
};


export const deleteRecipe = async (id) => {
 try {
   const recipeRef = doc(db, "recipes", id);
   await deleteDoc(recipeRef);
 } catch (error) {
   console.error("Error deleting recipe:", error);
   throw error;
 }
};

export const getCommunityRecipes = async (currentUserId) => {
  if (!currentUserId) return [];

  const q = query(
    collection(db, "recipes"),
    where("type", "==", "manual")
  );

  const snap = await getDocs(q);
  const all = [];

  snap.forEach((docSnap) => {
    all.push({ id: docSnap.id, ...docSnap.data() });
  });

  // Exclude logged-in user's recipes
  return all.filter(
    (r) => r.userId && r.userId !== currentUserId
  );
};