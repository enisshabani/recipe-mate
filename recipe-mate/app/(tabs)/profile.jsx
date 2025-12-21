import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert, TouchableOpacity, Switch, Image, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";
import { logOut } from "../../firebase/auth";
import { useRouter } from "expo-router";
import { useRecipes } from "../../contexts/RecipeContext";

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
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={animatedStyle}>
          {children}
        </Animated.View>
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

  const {user, loading, isAuthenticated} = useAuth();
  const { stats, recipes } = useRecipes();
  const router = useRouter();
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [loginButtonHovered, setLoginButtonHovered] = useState(false);
  const [signupButtonHovered, setSignupButtonHovered] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState("");

  useEffect(() => {
    loadReminderSettings();
    loadProfileImage();
    loadUserLocation();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.log('Error loading profile image:', error);
    }
  };

  const loadReminderSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('dailyReminderEnabled');
      if (enabled !== null) {
        setDailyReminderEnabled(JSON.parse(enabled));
      }
    } catch (error) {
      console.log('Error loading reminder settings:', error);
    }
  };

  const loadUserLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('userLocation');
      if (savedLocation) {
        setUserLocation(savedLocation);
      }
    } catch (error) {
      console.log('Error loading user location:', error);
    }
  };

  const handleEditLocation = () => {
    setTempLocation(userLocation);
    setShowLocationModal(true);
  };

  const handleSaveLocation = async () => {
    try {
      await AsyncStorage.setItem('userLocation', tempLocation);
      setUserLocation(tempLocation);
      setShowLocationModal(false);
      Alert.alert("Success", "Location updated!");
    } catch (error) {
      console.log('Error saving location:', error);
      Alert.alert("Error", "Failed to save location");
    }
  };

  const countries = [
    "", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
    "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraStatus.status !== "granted" ||
        mediaStatus.status !== "granted"
      ) {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and photo library permissions to add a profile picture."
        );
        return false;
      }
    }
    return true;
  };

  const pickProfileImage = async () => {
    setShowImageModal(false);
    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('profileImage', result.assets[0].uri);
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const takeProfilePhoto = async () => {
    setShowImageModal(false);
    const ok = await requestPermissions();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setProfileImage(result.assets[0].uri);
      await AsyncStorage.setItem('profileImage', result.assets[0].uri);
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const handleProfileImagePress = () => {
    if (profileImage) {
      setShowImagePreview(true);
    } else {
      Platform.OS === "web" ? pickProfileImage() : setShowImageModal(true);
    }
  };

  const scheduleDailyReminder = async () => {
    if (Platform.OS === "web") return;

    try {
      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule daily at 6 PM
      const trigger = {
        hour: 18,
        minute: 0,
        repeats: true,
      };

      const randomRecipe = recipes.length > 0 
        ? recipes[Math.floor(Math.random() * recipes.length)]
        : null;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🍳 Time to Cook!",
          body: randomRecipe 
            ? `How about trying "${randomRecipe.title}" today?`
            : "Time to cook something delicious!",
          sound: true,
        },
        trigger,
      });

      console.log('Daily reminder scheduled for 6 PM');
    } catch (error) {
      console.log('Error scheduling daily reminder:', error);
    }
  };

  const toggleDailyReminder = async (value) => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "Daily reminders are only available on mobile devices.");
      return;
    }

    setDailyReminderEnabled(value);
    await AsyncStorage.setItem('dailyReminderEnabled', JSON.stringify(value));

    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await scheduleDailyReminder();
        Alert.alert("Reminder Set!", "You'll receive a daily cooking reminder at 6 PM.");
      } else {
        setDailyReminderEnabled(false);
        await AsyncStorage.setItem('dailyReminderEnabled', 'false');
        Alert.alert("Permission Denied", "Please enable notifications in settings.");
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert("Reminder Disabled", "Daily cooking reminders have been turned off.");
    }
  };

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
              Sign in to your account to view your profile, save recipes, and
              manage your favorites.
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{width: '100%'}}>
              <TouchableOpacity
                style={[styles.loginButton, loginButtonHovered && styles.loginButtonHovered]}
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.8}
                onMouseEnter={() => setLoginButtonHovered(true)}
                onMouseLeave={() => setLoginButtonHovered(false)}
              >
                <Ionicons
                  name="log-in"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(500)} style={{width: '100%'}}>
              <TouchableOpacity
                style={[styles.signupButton, signupButtonHovered && styles.signupButtonHovered]}
                onPress={() => router.push("/(auth)/signup")}
                activeOpacity={0.8}
                onMouseEnter={() => setSignupButtonHovered(true)}
                onMouseLeave={() => setSignupButtonHovered(false)}
              >
                <Ionicons
                  name="person-add"
                  size={20}
                  color={textPrimary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
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
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          style={[
            styles.profileCard,
            { backgroundColor: "#2e573a" },
          ]}
        >
          <TouchableOpacity 
            onPress={handleProfileImagePress}
            activeOpacity={0.7}
            style={styles.avatarTouchable}
          >
            <View style={[styles.avatar, { backgroundColor: "#FFFFFF" }]}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons name="person" size={48} color={deepAccent} />
              )}
            </View>
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
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
          
          {/* Location Display */}
          <TouchableOpacity 
            style={styles.locationContainer}
            onPress={handleEditLocation}
            activeOpacity={0.7}
          >
            <Ionicons name="location" size={16} color="#fde3cf" />
            <Text style={styles.locationText}>
              {userLocation || "Add your location"}
            </Text>
            <Ionicons name="pencil" size={14} color="#fde3cf" style={{ opacity: 0.7 }} />
          </TouchableOpacity>
        </Animated.View>

        {/* Location Edit Modal */}
        <Modal
          visible={showLocationModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLocationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              entering={FadeInDown.duration(300)}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>Where are you from?</Text>
              
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={tempLocation}
                  onValueChange={(value) => setTempLocation(value)}
                  style={styles.countryPicker}
                >
                  <Picker.Item label="Select a country..." value="" />
                  {countries.map((country) => (
                    <Picker.Item key={country} label={country || "Select a country..."} value={country} />
                  ))}
                </Picker>
              </View>

              <View style={styles.locationModalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLocationModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveLocation}
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

        <Modal
          visible={showImageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              entering={FadeInDown.duration(300)}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={takeProfilePhoto}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={24} color="#2e573a" />
                <Text style={styles.modalButtonText}>Take a Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={pickProfileImage}
                activeOpacity={0.7}
              >
                <Ionicons name="image" size={24} color="#2e573a" />
                <Text style={styles.modalButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowImageModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        <Modal
          visible={showImagePreview}
          transparent
          animationType="fade"
          onRequestClose={() => setShowImagePreview(false)}
        >
          <View style={styles.imagePreviewOverlay}>
            <TouchableOpacity
              style={styles.imagePreviewClose}
              onPress={() => setShowImagePreview(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            
            <Image
              source={{ uri: profileImage }}
              style={styles.fullScreenProfileImage}
            />

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={() => {
                  setShowImagePreview(false);
                  Platform.OS === "web" ? pickProfileImage() : setShowImageModal(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={18} color="#fff" />
                <Text style={styles.previewButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          style={[styles.statsCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Your Stats
          </Text>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="restaurant" size={32} color={deepAccent} />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {totalRecipes}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Recipes
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="heart" size={32} color="#e74c3c" />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {favoritesCount}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Favorites
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="time" size={32} color={deepAccent} />
              <Text style={[styles.statValue, { color: textPrimary }]}>
                {cookingTimeLabel}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Cook Time
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500).springify()}
          style={[styles.settingsCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Settings
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color="#F4A300" />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: textPrimary }]}>
                  Daily Cooking Reminder
                </Text>
                <Text style={[styles.settingSubtitle, { color: textSecondary }]}>
                  Get reminded at 6 PM every day
                </Text>
              </View>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={toggleDailyReminder}
              trackColor={{ false: "#d1d1d6", true: "#2e573a" }}
              thumbColor="#ffffff"
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(450).duration(500).springify()}
          style={[styles.menuCard, { backgroundColor: cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Menu
          </Text>

          <AnimatedMenuButton onPress={handleFavorites} delay={500}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: "#FFFCFB" },
                  ]}
                >
                  <Ionicons name="heart" size={20} color="#F4A300" />
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
              <Ionicons name="chevron-forward" size={20} color="#F4A300" />
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
    paddingHorizontal: 32,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#2e573a',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2e573a',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 14,
    alignSelf: 'center',
  },
  loginButtonHovered: {
    backgroundColor: '#234528',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  signupButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2e573a',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'center',
  },
  signupButtonHovered: {
    backgroundColor: '#F5F5F5',
  },
  signupButtonText: {
    color: '#2e573a',
    fontSize: 16,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 0,
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
    marginHorizontal: 16,
    shadowColor: '#2e573a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#2e573a',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#2e573a',
  },
  avatarTouchable: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2e573a',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F4A300',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#fde3cf',
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#2e573a',
    borderRadius: 12,
    backgroundColor: '#FFFCFB',
    marginBottom: 20,
    overflow: 'hidden',
  },
  countryPicker: {
    height: 50,
    width: '100%',
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#2e573a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2e573a',
    backgroundColor: '#FFFCFB',
    marginBottom: 20,
  },
  locationModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2e573a',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#2e573a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#2e573a',
  },
  settingsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#2e573a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#2e573a',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
    marginHorizontal: 16,
    shadowColor: '#2e573a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#2e573a',
    borderWidth: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFCFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#F4A300',
    borderColor: '#F4A300',
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
    marginHorizontal: 16,
    shadowColor: '#2e573a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    borderColor: '#2e573a',
    borderWidth: 2,
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
  imagePreviewOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  fullScreenProfileImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    resizeMode: 'cover',
    borderWidth: 4,
    borderColor: '#F4A300',
  },
  imagePreviewClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2e573a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e573a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2e573a',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e573a',
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
});