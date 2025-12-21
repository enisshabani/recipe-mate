import React, { useEffect, useState } from "react";
import { Stack, useRouter, useRootNavigationState } from "expo-router";

import { RecipeProvider } from "../contexts/RecipeContext";
import { AuthProvider } from "../contexts/AuthContext";
import { getHasSeenOnboarding } from "../src/utils/onboardingStorage";

function OnboardingGuard() {
  const router = useRouter();
  const navState = useRootNavigationState();

  const [hasSeen, setHasSeen] = useState(null);
  const [didRedirect, setDidRedirect] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const v = await getHasSeenOnboarding();
        if (mounted) setHasSeen(v);
      } catch (e) {
        if (mounted) setHasSeen(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 2) Redirect para home/login 
  useEffect(() => {
    if (!navState?.key) return;       // prit router me u bo gati
    if (hasSeen === null) return;     // prit storage me u lexu
    if (didRedirect) return;          // mos e bo 2 here

    if (!hasSeen) {
      setDidRedirect(true);
      router.replace("/(onboarding)/step1");
    }
  }, [navState?.key, hasSeen, didRedirect, router]);

  return null;
}

function RootLayoutContent() {
  return (
    <RecipeProvider>
      <OnboardingGuard />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />

        <Stack.Screen name="add" />
        <Stack.Screen name="recipe" />
        <Stack.Screen name="editRecipe" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="mealDetails" />
      </Stack>
    </RecipeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
