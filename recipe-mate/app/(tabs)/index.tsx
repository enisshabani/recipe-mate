// app/(tabs)/index.tsx

// ✅ Plotësim i kërkesës së fazës 1: Home Page UI me FlatList (pa backend, vetëm prototip)
import React from "react";

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
import { useRouter } from "expo-router";
const router = useRouter();

export default function HomeScreen() {
  // ✅ Shembull i të dhënave statike për prototip (s'merr nga backend në fazën 1)
  const recipes = [
    {
      id: "1",
      title: "Spaghetti",
      time: "15 min",
      servings: 2,
      ingredients: ["Pasta", "Tomato", "Oil"],
   
    },
    {
      id: "2",
      title: "Salad",
      time: "5 min",
      servings: 1,
      ingredients: ["Lettuce", "Tomato"],
      category: "Lunch",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header si në screenshot (titull + butoni add) */}
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Mate</Text>

      {/* Butoni Add – me navigim */}
      <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")} // ✅ Hap faqen add.jsx
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/*  kërkesa: FlatList për listim */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            id={item.id}
            title={item.title}
            time={item.time}
            servings={item.servings}
            ingredientsCount={item.ingredients.length}
            
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// 🎨 UI stilim sipas screenshot (tonë pastel me fokus në lexueshmëri)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F2", // ngjyrë shumë e zbehtë pastel si sfond
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B2F2F", // kafe e errët
  },
  addButton: {
    backgroundColor: "#8B4513", // kafe si në screenshot
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});