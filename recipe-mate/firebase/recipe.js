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

/**
* Example for later when users are added:
* const q = query(collection(db, "recipes"), where("userId", "==", user.uid));
*/

// CREATE — SAFE VERSION
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
     userId: null,
   };

   const docRef = await addDoc(collection(db, "recipes"), recipeToSave);
   return docRef.id;
 } catch (error) {
   console.error("Error adding recipe:", error);
   throw error;
 }
};

// READ
export const getAllRecipes = async () => {
 try {
   const querySnapshot = await getDocs(collection(db, "recipes"));
   const data = [];

   querySnapshot.forEach((docSnap) => {
     data.push({
       id: docSnap.id,
       ...docSnap.data(),
     });
   });

   return data;
 } catch (error) {
   console.error("Error getting recipes:", error);
   throw error;
 }
};

// UPDATE — SAFE VERSION
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
   };

   await updateDoc(recipeRef, safeUpdate);
 } catch (error) {
   console.error("Error updating recipe:", error);
   throw error;
 }
};

// DELETE
export const deleteRecipe = async (id) => {
 try {
   const recipeRef = doc(db, "recipes", id);
   await deleteDoc(recipeRef);
 } catch (error) {
   console.error("Error deleting recipe:", error);
   throw error;
 }
};


