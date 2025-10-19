// Plotësim i kërkesës: Home Page UI me FlatList
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/recipeCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import {Link} from "expo-router";
import { TextInput } from "react-native";


const router = useRouter();

// Define a consistent type for the recipe
interface Recipe {
  id: string;
  title: string;
  time: string;
  servings?: number | string;
  ingredients: string[];
  instructions?: string; // Add instructions for consistency
  description?: string; // Add description for consistency
  category?: string;
}


export default function HomeScreen() {
  {/* Per histori te search*/ }
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);


  const [addedOnce, setAddedOnce] = useState(false);

  // Shembull i ni recete statike
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      title: "Spaghetti",
      time: "15 min",
      servings: 2,
      ingredients: ["Pasta", "Tomato", "Oil"],
      instructions: "Boil pasta and mix with sauce.",
      description: "A simple Italian classic.",
    },
  ]);

  const params = useLocalSearchParams(); // Lexo nëse po vjen recetë e re ose e modifikuar

  useEffect(() => {
    const raw = params.recipeData;
    if (!raw) return;

    let incomingRecipe: Recipe | null = null;
    try {
      incomingRecipe = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (!incomingRecipe?.id) return;

    setRecipes((prev) => {
      // GARANTO që INCOMING nuk është null dhe ka ID
      if (!incomingRecipe || !incomingRecipe.id) return prev;
    
      //  Ingredients gjith si array
      const parsedIngredients = Array.isArray(incomingRecipe.ingredients)
        ? incomingRecipe.ingredients
        : String(incomingRecipe.ingredients || "").split("\n");
    
      // Kontrollo nese ekziston tashme
      const exists = prev.some((r) => r.id === incomingRecipe!.id);
    
      if (exists) {
        // Perditsoje ekzistuesen
        return prev.map((recipe) =>
          recipe.id === incomingRecipe!.id
            ? { ...recipe, ...incomingRecipe, ingredients: parsedIngredients }
            : recipe
        );
      }
    
      // Shto te re
      return [...prev, { ...incomingRecipe, ingredients: parsedIngredients }];
    });
 }, [params.recipeData]); // prej recipeData



const filteredRecipes = recipes.filter((recipe) =>
  recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <SafeAreaView style={styles.container}>
      {/* Header (titull + butoni add) */}
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Mate</Text>

        {/* Butoni Add – me navigim */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")} // Hap faqen add.jsx
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      
      {/* Search Bar */}
<View style={styles.searchContainer}>
  <Ionicons name="search-outline" size={18} color="#777" style={{ marginRight: 6 }} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search for a recipe"
    placeholderTextColor="#999"
    value={searchQuery}
    onChangeText={setSearchQuery}
    onSubmitEditing={() => {
      if (searchQuery.trim() !== "" && !recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [...prev, searchQuery]);
      }
    }}
  />
</View>

  {/* Per search history */}
  {recentSearches.length > 0 && (
    <View style={styles.recentRow}>
      <Text style={styles.recentLabel}>Recent:</Text>
      <View style={styles.recentTagRow}>
        {recentSearches.map((term, index) => (
          <TouchableOpacity key={index} style={styles.recentTag} onPress={() => setSearchQuery(term)}>
            <Text style={styles.recentTagText}>{term}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )}


      {/* kërkesa: FlatList për listim */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Modified to pass the full recipe data as a string
          <RecipeCard
            recipe={item} 
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <View> 
      {/* <Link href="/editRecipe" style = {{  marginVertical: 10, borderBottomWidth: 1,}} >Edit Page</Link> */}
      </View>

    </SafeAreaView>

    
  );
}

// UI Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFB", 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 38,
    backgroundColor: "#2e573a", 
    borderBottomWidth: 1,
    borderBottomColor: "#2e573a", 
  },
  title: {
    fontSize: 26, 
    fontWeight: "800", // 
    color: "#fde3cf", // Recipe mate - zi
    fontFamily: "System",
    letterSpacing: 0.5, // pak spacing 
  },
  addButton: {
    backgroundColor: "#F8a91f", // Butoni i zi
    paddingHorizontal: 22,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fde3cf",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },


  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 6,
    gap: 8, // hapësir mes "Recent:" dhe tag-eve
  },
  recentLabel: {
    fontSize: 14,
    color: "#666",
  },
  recentTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  recentTag: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  recentTagText: {
    fontSize: 13,
    color: "#333",
  },
  
  
});