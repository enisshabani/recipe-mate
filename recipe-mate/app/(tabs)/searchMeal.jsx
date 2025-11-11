import React, { useState } from "react";
import {
 View,
 TextInput,
 TouchableOpacity,
 FlatList,
 Text,
 Image,
 StyleSheet,
 ActivityIndicator,
} from "react-native";
import { searchMealByName } from "@api/mealAPI";

 const defaultMeals = [
 {
   idMeal: "1",
   strMeal: "Margherita Pizza",
   strMealThumb: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
   strCategory: "Italian",
 },
 {
   idMeal: "2",
   strMeal: "Beef Burger",
   strMealThumb: "https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg",
   strCategory: "American",
 },
 {
   idMeal: "3",
   strMeal: "Chicken Alfredo Pasta",
   strMealThumb: "https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg",
   strCategory: "Pasta",
 },
 {
   idMeal: "4",
   strMeal: "Sushi Roll",
   strMealThumb: "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
   strCategory: "Japanese",
 },
 {
   idMeal: "5",
   strMeal: "Tacos",
   strMealThumb: "https://www.themealdb.com/images/media/meals/ypxvwv1505333929.jpg",
   strCategory: "Mexican",
 },
 {
   idMeal: "6",
   strMeal: "Chocolate Cake",
   strMealThumb: "https://www.themealdb.com/images/media/meals/tqtywx1468317395.jpg",
   strCategory: "Dessert",
 },
 {
   idMeal: "7",
   strMeal: "Cevapi Sausage",
   strMealThumb: "https://www.themealdb.com/images/media/meals/vc08jn1628769553.jpg",
   strCategory: "Meat",
 },
 {
   idMeal: "8",
   strMeal: "Minced Beef Pie",
   strMealThumb: " https://www.themealdb.com/images/media/meals/xwutvy1511555540.jpg",
   strCategory: "Meat, Pie",
 },
 {
   idMeal: "9",
   strMeal: "Tunisian Orange Cake",
   strMealThumb: "https://www.themealdb.com/images/media/meals/y4jpgq1560459207.jpg",
   strCategory: "Desert",
 },
];

export default function SearchScreen() {
 const [query, setQuery] = useState("");
 const [results, setResults] = useState([]);
 const [loading, setLoading] = useState(false);

 const handleSearch = async () => {
   if (!query.trim()) return;
   setLoading(true);
   const data = await searchMealByName(query);
   setResults(data || []);
   setLoading(false);
 };


 const NUM_COLUMNS = 3;

 return (
   <View style={styles.container}>
     <Text style={styles.header}>Search for a meal</Text>

     <View style={styles.searchSection}>
       <TextInput
         placeholder="Search for a meal..."
         value={query}
         onChangeText={setQuery}
         style={styles.input}
         placeholderTextColor="#999"
       />
       <TouchableOpacity style={styles.button} onPress={handleSearch}>
         <Text style={styles.buttonText}>Search</Text>
       </TouchableOpacity>
     </View>

     {loading ? (
       <ActivityIndicator size="large" color="#F4A300" style={{ marginTop: 30 }} />
     ) : results.length === 0 && query ? (
       <Text style={styles.noResults}>No meals found 😕</Text>
     ) : (
       <FlatList
         key={`cols-${NUM_COLUMNS}`}
         data={results.length > 0 ? results : defaultMeals}
         numColumns={NUM_COLUMNS}
         columnWrapperStyle={{ justifyContent: "space-between" }}
         keyExtractor={(item) => item.idMeal}
         renderItem={({ item }) => (
           <View style={styles.card}>
             <Image source={{ uri: item.strMealThumb }} style={styles.image} />
             <Text style={styles.mealName}>{item.strMeal}</Text>
             <Text style={styles.mealCategory}>{item.strCategory}</Text>
           </View>
         )}
         showsVerticalScrollIndicator={false}
         contentContainerStyle={styles.listContainer}
       />
     )}
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: "#FFFDFB",
 },
 header: {
   backgroundColor: "#2e573a",
   fontSize: 26,
   fontWeight: "700",
   color: "#fde3cf",
   textAlign: "left",
   paddingTop: 40,
   paddingBottom: 20,
   paddingHorizontal: 20,
   paddingVertical: 18,
   marginBottom: 18,
 },
 searchSection: {
   flexDirection: "row",
   alignItems: "center",
   marginBottom: 12,
   paddingHorizontal: 20,
   paddingVertical: 18,
 },
 input: {
   flex: 1,
   borderWidth: 1,
   borderColor: "#F4A300",
   paddingVertical: 8,
   paddingHorizontal: 12,
   borderRadius: 10,
   fontSize: 16,
   marginRight: 8,
   backgroundColor: "#fff",
 },
 button: {
   backgroundColor: "#F4A300",
   paddingVertical: 8,
   paddingHorizontal: 18,
   borderRadius: 10,
 },
 buttonText: {
   color: "#fff",
   fontWeight: "700",
   fontSize: 14,
 },
 listContainer: {
   paddingHorizontal: 16,
   paddingBottom: 20,
 },
 card: {
   backgroundColor: "#fff",
   borderRadius: 10,
   alignItems: "center",
   justifyContent: "center",
   width: "30%",
   height: "auto",
   marginBottom: 30,
   padding: 8,
   shadowColor: "#000",
   shadowOpacity: 0.08,
   shadowOffset: { width: 0, height: 2 },
   shadowRadius: 3,
   elevation: 2,
 },
 image: {
   width: "100%",
   height: 200,
   borderRadius: 10,
 },
 mealName: {
   fontSize: 13,
   fontWeight: "700",
   color: "#333",
   marginTop: 6,
   textAlign: "center",
 },
 mealCategory: {
   fontSize: 12,
   color: "#777",
   marginTop: 2,
   textAlign: "center",
 },
 noResults: {
   textAlign: "center",
   fontSize: 16,
   color: "#777",
   marginTop: 30,
 },
});


