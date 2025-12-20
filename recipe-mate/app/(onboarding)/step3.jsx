import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

const OPTIONS = [
  { key: "menu", label: "📖 Find tonight's menu" },
  { key: "fridge", label: "🪄 Know what you can do with the ingredients in your fridge and cupboard" },
  { key: "inspire", label: "💡 Inspire yourself for recipes" },
  { key: "waste", label: "🗑️ Reduce your food waste" },
];

export default function Step3() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFCFB",
      }}
    >
      <Text style={{ fontSize: 52, textAlign: "center" }}>🔎</Text>

      <Text
        style={{
          marginTop: 10,
          fontSize: 30,
          fontWeight: "900",
          color: "#2e573a",
          textAlign: "center",
        }}
      >
        Why are you here?
      </Text>

      <View style={{ marginTop: 22 }}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o.key}
            onPress={() => setSelected(o.key)}
            style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 10 }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: selected === o.key ? "#2e573a" : "#999",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
                marginTop: 3,
                backgroundColor: "#fff",
              }}
            >
              {selected === o.key ? (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#2e573a" }} />
              ) : null}
            </View>

            <Text style={{ fontSize: 18, color: "#666", flex: 1 }}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => router.push("/(onboarding)/step4")}
        disabled={!selected}
        style={{
          marginTop: 22,
          padding: 14,
          borderRadius: 14,
          backgroundColor: !selected ? "#b7c9bf" : "#2e573a",
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900" }}>
          Next
        </Text>
      </Pressable>
    </View>
  );
}
