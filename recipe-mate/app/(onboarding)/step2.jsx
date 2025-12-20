import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Step2() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFCFB",
      }}
    >
      <Text style={{ fontSize: 52, textAlign: "center" }}>🎉</Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 30,
          fontWeight: "900",
          color: "#2e573a",
          textAlign: "center",
        }}
      >
        Welcome {name}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 18,
          fontWeight: "700",
          color: "#2e573a",
          textAlign: "center",
        }}
      >
        We&apos;re delighted
      </Text>

      <Pressable
        onPress={() => router.push("/(onboarding)/step3")}
        style={{
          marginTop: 22,
          padding: 16,
          borderRadius: 999,
          backgroundColor: "#2e573a",
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900" }}>
          Let&apos;s go…
        </Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/(onboarding)/step1")} style={{ marginTop: 18 }}>
        <Text
          style={{
            textAlign: "center",
            color: "#2e573a",
            textDecorationLine: "underline",
            opacity: 0.85,
          }}
        >
          Oops, no it&apos;s not that in fact…
        </Text>
      </Pressable>
    </View>
  );
}
