import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  RefreshControl,
} from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/recipeCard";

const MemoRecipeCard = React.memo(RecipeCard);
import { useRouter } from "expo-router";
import { useRecipes } from "../../contexts/RecipeContext";

export default function HomeScreen() {
  const router = useRouter();
  const { recipes } = useRecipes();

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter((recipe) => recipe.title.toLowerCase().includes(q));
  }, [recipes, searchQuery]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const EmptyState = () => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptyText}>
        {searchQuery ? "Try a different search" : "Add your first recipe to get started"}
      </Text>
    </Animated.View>
  );

  const renderRecipeCard = useCallback(
    ({ item, index }) => <MemoRecipeCard recipe={item} index={index} />,
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Recipe Mate</Text>
          <Text style={styles.subtitle}>Discover delicious recipes</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#fde3cf" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#777" style={{ marginRight: 8 }} />
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </Animated.View>

      {recentSearches.length > 0 && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.recentRow}>
          <Text style={styles.recentLabel}>Recent:</Text>
          <View style={styles.recentTagRow}>
            {recentSearches.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentTag}
                onPress={() => setSearchQuery(term)}
                activeOpacity={0.7}
              >
                <Text style={styles.recentTagText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderRecipeCard}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={filteredRecipes.length === 0 ? styles.emptyContainer : { paddingBottom: 20 }}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2e573a"
            colors={["#2e573a"]}
          />
        }
      />
    </SafeAreaView>
  );
}

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
    paddingVertical: 20,
    backgroundColor: "#2e573a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fde3cf",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFCFB",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#2e573a",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#fde3cf",
    fontWeight: "700",
    fontSize: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  recentRow: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2e573a",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  recentTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recentTag: {
    backgroundColor: "#2e573a",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  recentTagText: {
    color: "#fde3cf",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2e573a",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyContainer: {
    flexGrow: 1,
  },
});
