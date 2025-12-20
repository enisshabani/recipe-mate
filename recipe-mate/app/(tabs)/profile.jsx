import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../firebase/auth";
import { useRouter } from "expo-router";
import { useRecipes } from "../../contexts/RecipeContext";
import { resetOnboarding } from "../../src/utils/onboardingStorage"; 
import { setSkipOnboardingThisSession } from "../../src/utils/sessionFlags";


// Animated Menu Button Component
const AnimatedMenuButton = ({ onPress, children, delay = 0 }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const backgroundColor = "#FFFCFB";
  const headerBackground = "#2e573a";
  const cardBackground = "#FFFFFF";
  const textPrimary = "#2e573a";
  const textSecondary = "#666666";
  const deepAccent = "#2e573a";

  const { user, loading, isAuthenticated } = useAuth();
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
  const cookingTimeLabel = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirmed = confirm("Are you sure you want to logout?");
      if (!confirmed) return;

      try {
        await resetOnboarding(); 
        const { error } = await logOut();
        if (error) {
          Alert.alert("Error", "Failed to logout: " + error);
          console.log("Logout error:", error);
        } else {
          console.log("Logout successful");
          setSkipOnboardingThisSession(true);
          router.replace("/(auth)/login");

        }
      } catch (err) {
        Alert.alert("Error", "An error occurred during logout");
        console.log("Logout error:", err);
      }
      return;
    }

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await resetOnboarding(); 
            const { error } = await logOut();
            if (error) {
              Alert.alert("Error", "Failed to logout: " + error);
              console.log("Logout error:", error);
            } else {
              console.log("Logout successful");
              setSkipOnboardingThisSession(true);
              router.replace("/(auth)/login");

            }
          } catch (err) {
            Alert.alert("Error", "An error occurred during logout");
            console.log("Logout error:", err);
          }
        },
        style: "destructive",
      },
    ]);
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={["top"]}>
        <View style={styles.container}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.notAuthContainer}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <Ionicons name="person-circle" size={80} color={textPrimary} />
            </Animated.View>
            <Animated.Text
              entering={FadeInDown.delay(200).duration(500)}
              style={{
                color: textPrimary,
                fontSize: 22,
                fontWeight: "700",
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Welcome to RecipeMate
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(300).duration(500)}
              style={{
                color: textSecondary,
                fontSize: 14,
                textAlign: "center",
                marginBottom: 32,
                lineHeight: 20,
              }}
            >
              Sign in to your account to view your profile, save recipes, and manage your favorites.
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ width: "100%" }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.8}
              >
                <Ionicons name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(500)} style={{ width: "100%" }}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push("/(auth)/signup")}
                activeOpacity={0.8}
              >
                <Ionicons name="person-add" size={20} color={textPrimary} style={{ marginRight: 8 }} />
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== "ios" && styles.contentContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          style={[styles.profileCard, { backgroundColor: "#2e573a" }]}
        >
          <View style={[styles.avatar, { backgroundColor: "#FFFFFF" }]}>
            <Ionicons name="person" size={48} color={deepAccent} />
          </View>
          <Text style={[styles.name, { color: "#fde3cf" }]}>{isAuthenticated ? user.email : "Recipe Chef"}</Text>
          <Text style={[styles.subtitle, { color: "#fde3cf", opacity: 0.85 }]}>Cooking enthusiast since 2024</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          style={[styles.statsCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Stats</Text>

          <View style={styles.statsContainer}>
            <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#fde3cf" }]}>
                <Ionicons name="book" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>{totalRecipes}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Total Recipes</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#fde3cf" }]}>
                <Ionicons name="heart" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>{favoritesCount}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Favorites</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: "#fde3cf" }]}>
                <Ionicons name="time" size={24} color={deepAccent} />
              </View>
              <Text style={[styles.statValue, { color: textPrimary }]}>{cookingTimeLabel}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Cooking Time</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(450).duration(500).springify()}
          style={[styles.menuCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Menu</Text>

          <AnimatedMenuButton onPress={handleFavorites} delay={500}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: "#FFFCFB" }]}>
                  <Ionicons name="heart" size={20} color={deepAccent} />
                </View>
                <Text style={[styles.menuItemText, { color: textPrimary }]}>My Favorites</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={deepAccent} />
            </View>
          </AnimatedMenuButton>

          <AnimatedMenuButton onPress={handleLogout} delay={550}>
            <View style={[styles.menuItem, styles.logoutItem]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: "#ffe6e6" }]}>
                  <Ionicons name="log-out" size={20} color="#d9534f" />
                </View>
                <Text style={[styles.menuItemText, { color: "#d9534f" }]}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d9534f" />
            </View>
          </AnimatedMenuButton>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(500).springify()}
          style={[styles.footerCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.footerTitle, { color: textPrimary }]}>Recipe Mate</Text>
          <Text style={[styles.footerVersion, { color: textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.footerDescription, { color: textSecondary }]}>
            Your personal recipe collection and cooking companion
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  notAuthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#2e573a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2e573a",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 14,
    width: "100%",
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  signupButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2e573a",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
  },
  signupButtonText: { color: "#2e573a", fontSize: 16, fontWeight: "700" },
  contentContainer: { padding: 16, paddingBottom: 20 },
  contentContainerWithTabBar: { paddingBottom: 100 },
  profileCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: { fontSize: 30, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14 },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: "#2e573a",
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  statsContainer: { flexDirection: "row", justifyContent: "space-between" },
  statItem: { flex: 1, alignItems: "center" },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#f0d5ba",
    shadowColor: "#F4A300",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: "600", marginBottom: 4 },
  statLabel: { fontSize: 12, textAlign: "center" },
  menuCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: "#2e573a",
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFCFB",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: "#000",
    borderColor: "#F4A300",
    borderWidth: 3,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  menuItemPressed: { transform: [{ scale: 0.98 }] },
  menuItemLast: { marginBottom: 0 },
  logoutItem: { marginTop: 12, borderColor: "#d9534f" },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: { fontSize: 16, fontWeight: "600", color: "#2e573a" },
  footerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: "#2e573a",
    borderWidth: 1,
  },
  footerTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  footerVersion: { fontSize: 12, marginBottom: 8 },
  footerDescription: { fontSize: 13, textAlign: "center", lineHeight: 18 },
});
