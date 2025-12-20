import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { setHasSeenOnboarding } from "../../src/utils/onboardingStorage";

export default function Done() {
  const router = useRouter();

  const finish = async () => {
    await setHasSeenOnboarding();
    router.replace("/(auth)/login");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFCFB",
      }}
    >
      <Text style={{ fontSize: 52, textAlign: "center" }}>✅</Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 30,
          fontWeight: "900",
          color: "#2e573a",
          textAlign: "center",
        }}
      >
        You&apos;re all set!
      </Text>

      <Pressable
        onPress={finish}
        style={{
          marginTop: 22,
          padding: 16,
          borderRadius: 16,
          backgroundColor: "#2e573a",
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900" }}>
          Continue to Login
        </Text>
      </Pressable>
    </View>
  );
}
