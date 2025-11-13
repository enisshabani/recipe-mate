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
import { useRouter } from "expo-router";

// REAL meals with working IDs
const defaultMeals = [
{
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  strCategory: "Chicken",
},
{
  idMeal: "52804",
  strMeal: "Poutine",
  strMealThumb: "https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg",
  strCategory: "Canadian",
},
{
  idMeal: "52844",
  strMeal: "Lasagna",
  strMealThumb: "https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg",
  strCategory: "Pasta",
},
{
  idMeal: "52959",
  strMeal: "Baked Salmon with Fennel",
  strMealThumb: "https://www.themealdb.com/images/media/meals/1548772327.jpg",
  strCategory: "Seafood",
},
{
  idMeal: "52819",
  strMeal: "Katsu Chicken Curry",
  strMealThumb: "https://www.themealdb.com/images/media/meals/vwrpps1503068729.jpg",
  strCategory: "Japanese",
},
{
  idMeal: "52940",
  strMeal: "Thai Green Curry",
  strMealThumb: "https://www.themealdb.com/images/media/meals/sstssx1487349585.jpg",
  strCategory: "Thai",
},
{
  idMeal: "53006",
  strMeal: "Chocolate Gateau",
  strMealThumb: "https://www.themealdb.com/images/media/meals/tqtywx1468317395.jpg",
  strCategory: "Dessert",
},
{
  idMeal: "52980",
  strMeal: "Honey Teriyaki Salmon",
  strMealThumb: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
  strCategory: "Seafood",
},
{
  idMeal: "52823",
  strMeal: "Lamb Rogan Josh",
  strMealThumb: "https://www.themealdb.com/images/media/meals/vvstvq1487342592.jpg",
  strCategory: "Lamb",
},
];


export default function SearchScreen() {
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const router = useRouter();

const handleSearch = async () => {
  if (!query.trim()) return;
  setLoading(true);
  const data = await searchMealByName(query);
  setResults(data || []);
  setLoading(false);
};

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
        data={results.length > 0 ? results : defaultMeals}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`../mealDetails?id=${item.idMeal}`)}
          >
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            <Text style={styles.mealName}>{item.strMeal}</Text>
            <Text style={styles.mealCategory}>{item.strCategory}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    )}
  </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#FFFDFB" },
header: {
  backgroundColor: "#2e573a",
  fontSize: 26,
  fontWeight: "700",
  color: "#fde3cf",
  paddingTop: 40,
  paddingBottom: 20,
  paddingHorizontal: 20,
},
searchSection: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 18,
},
input: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#F4A300",
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: "#fff",
  marginRight: 8,
},
button: {
  backgroundColor: "#F4A300",
  paddingVertical: 8,
  paddingHorizontal: 18,
  borderRadius: 10,
},
buttonText: { color: "#fff", fontWeight: "700" },
listContainer: { paddingHorizontal: 16 },
card: {
  backgroundColor: "#fff",
  width: "30%",
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 20,
  padding: 6,
},
image: { width: "100%", height: 160, borderRadius: 10 },
mealName: { fontSize: 12, fontWeight: "700", marginTop: 4, textAlign: "center" },
mealCategory: { color: "#777", fontSize: 11 },
noResults: { textAlign: "center", marginTop: 20, color: "#777" },
});




