import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { RecipeProvider } from "../contexts/RecipeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { getHasSeenOnboarding } from "../src/utils/onboardingStorage";
import { getSkipOnboardingThisSession } from "../src/utils/sessionFlags";



function OnboardingGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { loading, isAuthenticated } = useAuth();

  const [ready, setReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(false);

  // Lexo nga AsyncStorage (startup)
  useEffect(() => {
    (async () => {
      try {
        const v = await getHasSeenOnboarding();
        setHasSeenOnboardingState(v);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Re-check kur ndryshon route 
  useEffect(() => {
    if (!ready) return;
    (async () => {
      const v = await getHasSeenOnboarding();
      if (v !== hasSeenOnboarding) setHasSeenOnboardingState(v);
    })();
    
  }, [segments]);

  useEffect(() => {
    if (!ready) return;
    if (loading) return;

    const root = segments[0]; 

    const inOnboarding = root === "(onboarding)";
    const inAuth = root === "(auth)";
    const inTabs = root === "(tabs)";

const skipThisSession = getSkipOnboardingThisSession();

if (!hasSeenOnboarding && !inOnboarding) {

  if (inAuth && skipThisSession) return;

  router.replace("/(onboarding)/step1");
  return;
}



    if (hasSeenOnboarding) {
      if (isAuthenticated) {
        if (!inTabs) router.replace("/(tabs)");
      } else {
        if (!inAuth) router.replace("/(auth)/login");
      }
    }
  }, [ready, hasSeenOnboarding, loading, isAuthenticated, segments, router]);

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
