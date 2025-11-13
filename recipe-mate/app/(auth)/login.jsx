import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, SafeAreaView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { signIn, signInWithGoogle, signInWithGitHub } from "../../firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    const { user, error } = await signIn(email, password);

    if (error) {
      Alert.alert("Login Failed", error);
    } else {
      // Navigation happens automatically via root layout
      router.replace("/(tabs)");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { user, error } = await signInWithGoogle();
    
    if (error) {
      Alert.alert("Google Login Failed", error);
    } else {
      router.replace("/(tabs)");
    }
    setLoading(false);
  };

  const handleGitHubLogin = async () => {
    setLoading(true);
    const { user, error } = await signInWithGitHub();
    
    if (error) {
      Alert.alert("GitHub Login Failed", error);
    } else {
      router.replace("/(tabs)");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RecipeMate</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back to your recipes</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton, loading && styles.buttonDisabled]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Text style={styles.socialButtonText}>🔍 Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.githubButton, loading && styles.buttonDisabled]}
          onPress={handleGitHubLogin}
          disabled={loading}
        >
          <Text style={styles.socialButtonText}>⚫ GitHub</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            disabled={loading}
          >
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingVertical: 16,
    backgroundColor: "#2e573a",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e573a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#2e573a",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2e573a",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#2e573a",
    fontSize: 14,
  },
  linkText: {
    color: "#2e573a",
    fontSize: 14,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    paddingHorizontal: 12,
    color: "#999",
    fontSize: 12,
  },
  socialButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1.5,
  },
  googleButton: {
    borderColor: "#2e573a",
    backgroundColor: "#f9f9f9",
  },
  githubButton: {
    borderColor: "#2e573a",
    backgroundColor: "#f9f9f9",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e573a",
  },
});
