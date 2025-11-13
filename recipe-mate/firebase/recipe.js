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
   * SHEMBULL SI DO LIDHET MË VONË ME USER:
   * const q = query(collection(db, "recipes"), where("userId", "==", user.uid));
   * Këtë e aktivizojmë kur ta shtoni login-in.
   */
  
  // CREATE
  export const addRecipe = async (recipe) => {
    try {
      const recipeToSave = {
        ...recipe,
        userId: null, // më vonë: auth.currentUser.uid
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
  
   // UPDATE
 export const updateRecipe = async (id, updatedFields) => {
   try {
     const recipeRef = doc(db, "recipes", id);
     await updateDoc(recipeRef, updatedFields);
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


  