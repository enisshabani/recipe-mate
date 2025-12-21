# Mobile OAuth Setup Guide

Mobile OAuth has been added to your app! Both web and mobile authentication now work side-by-side.

## 🔧 Setup Required

You need to configure OAuth credentials for mobile to work. Follow these steps:

### 1️⃣ Google OAuth Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication > Sign-in method > Google**
4. Find your **Web Client ID** (it ends with `.apps.googleusercontent.com`)
5. Copy the Web Client ID
6. Open `firebase/auth.js`
7. Replace `YOUR_GOOGLE_WEB_CLIENT_ID` with your actual client ID (line ~67)

Example:
```javascript
const clientId = "123456789-abc123xyz.apps.googleusercontent.com";
```

### 2️⃣ GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: RecipeMate
   - **Homepage URL**: `https://your-app-domain.com` (or any URL)
   - **Authorization callback URL**: `recipemateapp://auth`
4. Click **"Register application"**
5. Copy the **Client ID** and generate a **Client Secret**
6. Open `firebase/auth.js`
7. Replace `YOUR_GITHUB_CLIENT_ID` and `YOUR_GITHUB_CLIENT_SECRET` (lines ~89-90)

Example:
```javascript
const clientId = "abc123xyz456";
const clientSecret = "secret789xyz123abc";
```

⚠️ **Security Note**: For production apps, never store client secrets in your code. Use environment variables or a backend proxy.

### 3️⃣ Facebook OAuth Setup (Optional)

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Choose **"Consumer"** as the app type
4. Fill in the app details
5. In your app dashboard, go to **Settings > Basic**
6. Copy your **App ID**
7. Open `firebase/auth.js`
8. Replace `YOUR_FACEBOOK_APP_ID` (around line ~185)

Example:
```javascript
const clientId = "123456789012345";
```

9. In Facebook App Settings, add OAuth redirect URIs:
   - Add `recipemateapp://auth`
   - Add your Firebase OAuth redirect URL

### 4️⃣ Add OAuth Credentials to Firebase

For GitHub to work with Firebase:
1. Go to Firebase Console > Authentication > Sign-in method > GitHub
2. Enable GitHub provider
3. Add your GitHub **Client ID** and **Client Secret**
4. Copy the **Authorization callback URL** from Firebase
5. Go back to your GitHub OAuth App settings
6. Update the **Authorization callback URL** with the Firebase URL

## 🧪 Testing

1. Run your app: `npx expo start --tunnel`
2. Open on a physical device or emulator
3. Try logging in with Google or GitHub
4. The OAuth flow should open in a browser and redirect back to your app

## 📱 How It Works

- **Web**: Uses `signInWithPopup` (existing functionality preserved)
- **Mobile**: Uses `expo-auth-session` with native browser flow
- Both methods end up calling Firebase authentication with proper credentials

## ✅ What's Already Done

- ✅ expo-auth-session, expo-web-browser, expo-crypto installed
- ✅ Platform detection added (web vs mobile)
- ✅ OAuth redirect URL scheme configured (`recipemateapp://auth`)
- ✅ Google and GitHub mobile OAuth implemented
- ✅ Web login still works exactly as before

## 🐛 Troubleshooting

**Error: "Invalid client ID"**
- Double-check you copied the full client ID correctly
- Make sure there are no extra spaces

**OAuth window closes immediately**
- Check the redirect URI matches: `recipemateapp://auth`
- Verify the scheme in app.json is `recipemateapp` (it has been updated)

**GitHub says "Redirect URI mismatch"**
- Make sure the GitHub OAuth app callback URL is exactly `recipemateapp://auth`
- Also add the Firebase callback URL from your Firebase Console

**Works on web but not mobile**
- Verify you've set up the credentials in `firebase/auth.js`
- Check the app scheme in `app.json` is `recipemateapp`
- Make sure you're testing on a real device or proper emulator
