import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Step1() {
  const router = useRouter();
  const [name, setName] = useState("");

  const next = () => {
    const n = name.trim();
    if (!n) return;
    router.push({ pathname: "/(onboarding)/step2", params: { name: n } });
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
      <Text style={{ fontSize: 50, textAlign: "center" }}>👋</Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 30,
          fontWeight: "800",
          color: "#2e573a",
          textAlign: "center",
        }}
      >
        Welcome...?
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
        What is your name? *
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Rina"
        style={{
          marginTop: 18,
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 999,
          backgroundColor: "#FFFFFF",
          borderWidth: 2,
          borderColor: "#2e573a",
          color: "#2e573a",
          fontSize: 20,
          textAlign: "center",
          fontWeight: "700",
        }}
        placeholderTextColor="#999"
      />

      <Text style={{ marginTop: 10, textAlign: "center", color: "#666" }}>
        * mandatory data
      </Text>

      <Pressable
        onPress={next}
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 14,
          backgroundColor: "#2e573a",
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>
          Continue
        </Text>
      </Pressable>
    </View>
  );
}
