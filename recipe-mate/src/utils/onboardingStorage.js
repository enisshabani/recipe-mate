import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "hasSeenOnboarding";

export async function getHasSeenOnboarding() {
  const v = await AsyncStorage.getItem(KEY);
  return v === "true";
}

export async function setHasSeenOnboarding() {
  await AsyncStorage.setItem(KEY, "true");
}

export async function resetOnboarding() {
  await AsyncStorage.removeItem(KEY);
}
