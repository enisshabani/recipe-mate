import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";

WebBrowser.maybeCompleteAuthSession();

// Helper function to convert to base64URL encoding
function base64URLEncode(str) {
  return str
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Google signin
export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === "web") {
      // Web-based OAuth flow
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { user: userCredential.user, error: null };
    } else {
      // Mobile OAuth flow using expo-auth-session
      // Use Expo's auth proxy which is already trusted by Google
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      console.log("=== GOOGLE LOGIN DEBUG ===");
      console.log("Redirect URI:", redirectUri);
      console.log("========================");

      // You need to add your Google Web Client ID here
      // Get it from Firebase Console > Authentication > Sign-in method > Google
      const clientId = "291967570313-3tm8191lcu465vpjqbt65mfn4gi3o0qj.apps.googleusercontent.com";

      // Check if credentials are configured
      if (clientId.includes("YOUR_")) {
        return { 
          user: null, 
          error: "Google OAuth not configured yet. Please add your Web Client ID in firebase/auth.js. See OAUTH_SETUP.md for instructions." 
        };
      }

      // Use authorization code flow with PKCE (more secure for mobile)
      // Generate random code verifier
      const array = new Uint8Array(32);
      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const codeVerifier = base64URLEncode(
        btoa(String.fromCharCode(...randomBytes))
      );
      
      // Create code challenge
      const challengeHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        codeVerifier
      );
      const codeChallenge = base64URLEncode(challengeHash);

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      })}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        // Parse the URL to get the authorization code
        const url = new URL(result.url);
        const code = url.searchParams.get("code");
        
        if (code) {
          // Exchange code for tokens
          const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: clientId,
              code: code,
              code_verifier: codeVerifier,
              grant_type: "authorization_code",
              redirect_uri: redirectUri,
            }).toString(),
          });

          const tokens = await tokenResponse.json();
          if (tokens.id_token) {
            const credential = GoogleAuthProvider.credential(tokens.id_token);
            const userCredential = await signInWithCredential(auth, credential);
            return { user: userCredential.user, error: null };
          }
        }
      }
      
      return { user: null, error: "Google login cancelled or failed" };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with GitHub
export const signInWithGitHub = async () => {
  try {
    if (Platform.OS === "web") {
      // Web-based OAuth flow
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { user: userCredential.user, error: null };
    } else {
      // Mobile OAuth flow using expo-auth-session
      // Use Expo's auth proxy
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      // You need to register an OAuth app on GitHub and add the Client ID here
      // https://github.com/settings/developers
      const clientId = "Ov23liQt5gT2kndgtAOO";
      const clientSecret = "ad8e36b1704ecf3d4cfd7b20b2f6522a0efdc90f";

      // Check if credentials are configured
      if (clientId.includes("YOUR_") || clientSecret.includes("YOUR_")) {
        return { 
          user: null, 
          error: "GitHub OAuth not configured yet. Please add your Client ID and Secret in firebase/auth.js. See OAUTH_SETUP.md for instructions." 
        };
      }

      const discovery = {
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
        tokenEndpoint: "https://github.com/login/oauth/access_token",
      };

      const authUrl = `${discovery.authorizationEndpoint}?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "read:user user:email",
      })}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        // Parse the URL to get the code
        const url = new URL(result.url);
        const code = url.searchParams.get("code");
        
        if (code) {
          // Exchange code for access token
          const tokenResponse = await fetch(discovery.tokenEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code: code,
              redirect_uri: redirectUri,
            }),
          });

          const tokenData = await tokenResponse.json();
          if (tokenData.access_token) {
            const credential = GithubAuthProvider.credential(tokenData.access_token);
            const userCredential = await signInWithCredential(auth, credential);
            return { user: userCredential.user, error: null };
          }
        }
      }
      
      return { user: null, error: "GitHub login cancelled or failed" };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    if (Platform.OS === "web") {
      // Web-based OAuth flow
      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { user: userCredential.user, error: null };
    } else {
      // Mobile OAuth flow using expo-auth-session
      // Use Expo's auth proxy
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      // You need to create a Facebook App and add the App ID here
      // https://developers.facebook.com/apps/
      const clientId = "YOUR_FACEBOOK_APP_ID";

      // Check if credentials are configured
      if (clientId.includes("YOUR_")) {
        return { 
          user: null, 
          error: "Facebook OAuth not configured yet. Please add your App ID in firebase/auth.js. See OAUTH_SETUP.md for instructions." 
        };
      }

      const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "token",
        scope: "public_profile,email",
      })}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success" && result.url) {
        // Parse the URL to get the access_token from the hash fragment
        const url = new URL(result.url);
        const params = new URLSearchParams(url.hash.substring(1)); // Remove # and parse
        const accessToken = params.get("access_token");
        
        if (accessToken) {
          const credential = FacebookAuthProvider.credential(accessToken);
          const userCredential = await signInWithCredential(auth, credential);
          return { user: userCredential.user, error: null };
        }
      }
      
      return { user: null, error: "Facebook login cancelled or failed" };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};