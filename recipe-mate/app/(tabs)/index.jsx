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
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInDown, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/recipeCard";

import { useRouter } from "expo-router";
import { useRecipes } from "../../contexts/RecipeContext";

export default function HomeScreen() {
  const router = useRouter();
  const { recipes } = useRecipes();

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [addButtonHovered, setAddButtonHovered] = useState(false);

  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(searchExpanded ? 200 : 0, { duration: 300 }),
      opacity: withTiming(searchExpanded ? 1 : 0, { duration: 300 }),
    };
  });

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
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptyText}>
        {searchQuery ? "Try a different search" : "Add your first recipe to get started"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[styles.emptyAddButton, addButtonHovered && styles.emptyAddButtonHovered]}
          onPress={() => router.push("/add")}
          activeOpacity={0.8}
          onMouseEnter={() => setAddButtonHovered(true)}
          onMouseLeave={() => setAddButtonHovered(false)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.emptyAddButtonText}>Add Recipe</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRecipeCard = useCallback(
    ({ item, index }) => <RecipeCard recipe={item} index={index} />,
    []
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!(searchExpanded && Platform.OS !== 'web') && (
          <View>
            <Text style={styles.title}>Recipe Mate</Text>
            <Text style={styles.subtitle}>Discover delicious recipes</Text>
          </View>
        )}
        
        <Animated.View 
          entering={FadeIn.delay(200).duration(500)} 
          style={[
            styles.headerSearchContainer,
            searchExpanded && Platform.OS !== 'web' && styles.headerSearchContainerExpanded
          ]}
          onMouseEnter={() => Platform.OS === 'web' && setSearchExpanded(true)}
          onMouseLeave={() => {
            if (Platform.OS === 'web' && !searchQuery) setSearchExpanded(false);
          }}
        >
          <TouchableOpacity 
            style={styles.searchIconWrapper}
            activeOpacity={0.7}
            onPress={() => Platform.OS !== 'web' && setSearchExpanded(true)}
          >
            <Ionicons name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>
          
          {(Platform.OS === 'web' && searchExpanded) && (
            <Animated.View style={[styles.searchInputWrapper, searchAnimatedStyle]}>
              <TextInput
                style={styles.headerSearchInput}
                placeholder="Search for a recipe"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onBlur={() => {
                  if (Platform.OS === 'web' && !searchQuery) setSearchExpanded(false);
                }}
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
          )}
          
          {(Platform.OS !== 'web' && searchExpanded) && (
            <Animated.View style={[styles.searchInputWrapper, styles.searchInputWrapperMobile]}>
              <TextInput
                style={styles.headerSearchInput}
                placeholder="Search for a recipe"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
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
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery("");
                  setSearchExpanded(false);
                }}
                style={styles.closeMobileButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </View>

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
      
      {filteredRecipes.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/add")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
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
    alignItems: Platform.OS === 'web' ? "center" : "flex-start",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 28 : 20,
    paddingBottom: Platform.OS === 'android' ? 16 : 20,
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
  headerSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
    marginTop: Platform.OS === 'web' ? 0 : 8,
  },
  headerSearchContainerExpanded: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  searchIconWrapper: {
    padding: 4,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginLeft: 8,
  },
  searchInputWrapperMobile: {
    flex: 1,
  },
  headerSearchInput: {
    fontSize: 14,
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    flex: 1,
  },
  closeMobileButton: {
    padding: 4,
    marginLeft: 8,
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
    borderColor: "#2e573a",
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
    marginBottom: 24,
  },
  emptyAddButton: {
    flexDirection: "row",
    backgroundColor: "#2e573a",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#2e573a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyAddButtonHovered: {
    backgroundColor: "#234528",
  },
  emptyAddButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === 'android' ? 90 : 90,
    backgroundColor: "#2e573a",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
