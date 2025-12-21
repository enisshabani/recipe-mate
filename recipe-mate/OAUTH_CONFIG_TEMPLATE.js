// ⚠️ CONFIGURATION REQUIRED FOR MOBILE OAUTH ⚠️
//
// This file shows exactly where you need to add your OAuth credentials.
// See OAUTH_SETUP.md for detailed setup instructions.

// ==========================================
// GOOGLE OAUTH - Line ~76 in firebase/auth.js
// ==========================================
// FIND THIS LINE:
const clientId = "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com";

// REPLACE WITH:
const clientId = "123456789-abc123xyz.apps.googleusercontent.com";
// ↑ Get this from Firebase Console > Authentication > Sign-in method > Google


// ==========================================
// GITHUB OAUTH - Lines ~118-119 in firebase/auth.js
// ==========================================
// FIND THESE LINES:
const clientId = "YOUR_GITHUB_CLIENT_ID";
const clientSecret = "YOUR_GITHUB_CLIENT_SECRET";

// REPLACE WITH:
const clientId = "abc123xyz456";
const clientSecret = "secret789xyz123abc";
// ↑ Get these from https://github.com/settings/developers
//   Create a new OAuth App with callback: recipemateapp://auth


// ==========================================
// FACEBOOK OAUTH (OPTIONAL) - Line ~185 in firebase/auth.js
// ==========================================
// FIND THIS LINE:
const clientId = "YOUR_FACEBOOK_APP_ID";

// REPLACE WITH:
const clientId = "123456789012345";
// ↑ Get this from https://developers.facebook.com/apps/


// ==========================================
// QUICK TEST
// ==========================================
// After setting up credentials:
// 1. Run: npx expo start --tunnel
// 2. Open app on physical device
// 3. Try Google/GitHub login buttons
// 4. Browser should open → login → redirect back to app
// 5. You should be logged in!
