import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { getCommunityRecipes } from "../../firebase/recipe";

export default function SearchScreen() {
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 LIVE SEARCH TEXT
  const [searchText, setSearchText] = useState("");

  const { user } = useAuth();
  const router = useRouter();

  // 🔹 LIVE FILTERING (PA ENTER)
  const filteredRecipes = useMemo(() => {
    if (!searchText.trim()) return communityRecipes;

    return communityRecipes.filter((recipe) =>
      recipe.title
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [searchText, communityRecipes]);

  useEffect(() => {
    const loadCommunityRecipes = async () => {
      if (!user?.uid) {
        setCommunityRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await getCommunityRecipes(user.uid);
      setCommunityRecipes(data);
      setLoading(false);
    };

    loadCommunityRecipes();
  }, [user?.uid]);

  const renderCommunityCard = useCallback(
    ({ item, index }) => (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(500).springify()}
        style={styles.apiLikeCard}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => router.push(`/communityRecipe?id=${item.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>
              {item.title?.charAt(0)?.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.cardCategory}>Community Recipe</Text>
        </TouchableOpacity>
      </Animated.View>
    ),
    [router]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Search Recipes</Text>

        {/* API NAVIGATION BUTTON */}
        <View style={styles.apiButtonWrapper}>
          <TouchableOpacity
            style={styles.apiButton}
            onPress={() => router.push("/apiRecipes")}
          >
            <Text style={styles.apiButtonText}>Explore API Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 LIVE SEARCH INPUT */}
        <View style={styles.searchSection}>
          <TextInput
            placeholder="Search for a recipe..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#F4A300" />
        ) : (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={filteredRecipes}  
            numColumns={3}
            keyExtractor={(item) => String(item.id)}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={renderCommunityCard}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={7}
            updateCellsBatchingPeriod={50}
          />
        )}
      </View>
    </KeyboardAvoidingView>
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
  apiButtonWrapper: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  apiButton: {
    backgroundColor: "#2e573a",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  apiButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#F4A300",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingHorizontal: 20,   
    paddingTop: 16,          
    paddingBottom: 100,      
  },
  
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 6,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2e573a",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  metaText: {
    fontSize: 13,
    color: "#666",
  },
  apiLikeCard: {
    backgroundColor: "#fff",
    width: "30%",
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  
  cardTouchable: {
    width: "100%",
    paddingBottom: 10,
    alignItems: "center",
  },
  
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#2e573a",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  
  imagePlaceholderText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fde3cf",
  },
  
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2e573a",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 6,
  },
  
  cardCategory: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  
});
