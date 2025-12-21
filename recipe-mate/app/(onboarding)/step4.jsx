import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

const OPTIONS = [
  { key: "instagram", label: "📸 Instagram" },
  { key: "facebook", label: "📘 Facebook" },
  { key: "friend", label: "🫂 Suggested by a friend" },
  { key: "other", label: "🔎 Other" },
];

export default function Step4() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FFFCFB" }}>
      <Text style={{ fontSize: 52, textAlign: "center" }}>🧭</Text>

      <Text style={{ marginTop: 10, fontSize: 30, fontWeight: "900", color: "#2e573a", textAlign: "center" }}>
        How did you find us?
      </Text>

      <View style={{ marginTop: 22 }}>
        {OPTIONS.map(o => (
          <Pressable key={o.key} onPress={() => setSelected(o.key)} style={{ paddingVertical: 12 }}>
            <Text style={{ fontSize: 18, color: "#666" }}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        disabled={!selected}
        onPress={() => router.push("/(onboarding)/done")}
        style={{
          marginTop: 22,
          padding: 14,
          borderRadius: 14,
          backgroundColor: selected ? "#2e573a" : "#b7c9bf",
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900" }}>
          Next
        </Text>
      </Pressable>
    </View>
  );
}
