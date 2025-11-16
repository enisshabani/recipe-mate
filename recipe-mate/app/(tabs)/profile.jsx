import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../firebase/auth";
import { useRouter } from "expo-router";
import { useRecipes } from "../../contexts/RecipeContext";


export default function ProfileScreen() {
  const backgroundColor = "#FFFCFB";
  const headerBackground = "#2e573a";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2e573a";
  const textSecondary = "#666666";
  const deepAccent = "#2e573a";

  const {user, loading, isAuthenticated} = useAuth();
  const { stats } = useRecipes();
  const router = useRouter();

  const { totalRecipes, favoritesCount, totalCookingTimeMinutes } = stats || {
    totalRecipes: 0,
    favoritesCount: 0,
    totalCookingTimeMinutes: 0,
  };

  const totalMinutes = totalCookingTimeMinutes || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const cookingTimeLabel =
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const handleLogout = async () => {
    // On web, the native Alert may not behave as expected — use a confirm fallback
    if (Platform.OS === "web") {
      const confirmed = confirm("Are you sure you want to logout?");
      if (!confirmed) return;
      try {
        const { error } = await logOut();
        if (error) {
          Alert.alert("Error", "Failed to logout: " + error);
          console.log("Logout error:", error);
        } else {
          console.log("Logout successful");
          // Ensure navigation on web — go to root so RootLayout will show auth stack
          router.replace("/");
        }
      } catch (err) {
        Alert.alert("Error", "An error occurred during logout");
        console.log("Logout error:", err);
      }
      return;
    }

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              const { error } = await logOut();
              if (error) {
                Alert.alert("Error", "Failed to logout: " + error);
                console.log("Logout error:", error);
              } else {
                console.log("Logout successful");
                router.replace("/");
              }
            } catch (err) {
              Alert.alert("Error", "An error occurred during logout");
              console.log("Logout error:", err);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

const handleFavorites = () => {
    router.push("/favorites");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "This feature is coming soon!");
  };

  const handleHelp = () => {
    Alert.alert("Help & Support", "This feature is coming soon!");
  };

  console.log(user, loading, isAuthenticated, "<<< PROFILE AUTH CONTEXT");

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor }]}
        edges={["top"]}
      >
        <View style={styles.container}>
          <View style={styles.notAuthContainer}>
            <Ionicons name="person-circle" size={80} color={textPrimary} />
            <Text
              style={{
                color: textPrimary,
                fontSize: 22,
                fontWeight: "700",
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Welcome to RecipeMate
            </Text>
            <Text
              style={{
                color: textSecondary,
                fontSize: 14,
                textAlign: "center",
                marginBottom: 32,
                lineHeight: 20,
              }}
            >
              Sign in to your account to view your profile, save recipes, and
              manage your favorites.
            </Text>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Ionicons
                name="log-in"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => router.push("/(auth)/signup")}
            >
              <Ionicons
                name="person-add"
                size={20}
                color={textPrimary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== "ios" && styles.contentContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.profileCard,
            { backgroundColor: "#2e573a" },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: "#FFFFFF" }]}>
            <Ionicons name="person" size={48} color={deepAccent} />
          </View>
          <Text style={[styles.name, { color: "#fde3cf" }]}>
            {isAuthenticated ? user.email : "Recipe Chef"}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: "#fde3cf", opacity: 0.85 },
            ]}
          >
            Cooking enthusiast since 2024
          </Text>
        </View>

        <View
          style={[styles.statsCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Your Stats
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#fde3cf" },
                ]}
              >
                <Ionicons name="book" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {totalRecipes}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Total Recipes
              </Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#fde3cf" },
                ]}
              >
                <Ionicons name="heart" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {favoritesCount}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Favorites
              </Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#fde3cf" },
                ]}
              >
                <Ionicons name="time" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {cookingTimeLabel}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Cooking Time
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.menuCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Menu
          </Text>

          <TouchableOpacity onPress={handleFavorites} activeOpacity={0.7}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: "#FFFCFB" },
                  ]}
                >
                  <Ionicons name="heart" size={20} color={deepAccent} />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    { color: textPrimary },
                  ]}
                >
                  My Favorites
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={deepAccent} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.menuItem, styles.logoutItem]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: "#ffe6e6" }]}>
                  <Ionicons name="log-out" size={20} color="#d9534f" />
                </View>
                <Text style={[styles.menuItemText, { color: "#d9534f" }]}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d9534f" />
            </View>
          </TouchableOpacity>
        </View>

  <View style={[styles.footerCard, { backgroundColor: cardBackground }]}>
          <Text style={[styles.footerTitle, { color: textPrimary }]}>Recipe Mate</Text>
          <Text style={[styles.footerVersion, { color: textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.footerDescription, { color: textSecondary }]}>
            Your personal recipe collection and cooking companion
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#2e573a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2e573a',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  signupButtonText: {
    color: '#2e573a',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
    profileCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#2e573a',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0d5ba',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#2e573a',
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFCFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: '#000',
    borderColor: '#F4A300',
    borderWidth: 3,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  menuItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  menuItemLast: {
    marginBottom: 0,
  },
  logoutItem: {
    marginTop: 12,
    borderColor: "#d9534f",
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e573a',
  },
  footerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#2e573a',
    borderWidth: 1,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    marginBottom: 8,
  },
  footerDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});