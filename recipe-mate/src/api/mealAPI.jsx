import axios from "axios";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

export const searchMealByName = async (name) => {
 try {
   const response = await axios.get(`${BASE_URL}search.php?s=${name}`);
   return response.data.meals;
 } catch (error) {
   console.error("Error fetching meals:", error);
   return [];
 }
};

export const getRandomMeal = async () => {
 try {
   const response = await axios.get(`${BASE_URL}random.php`);
   return response.data.meals[0];
 } catch (error) {
   console.error("Error fetching random meal:", error);
   return null;
 }
};


