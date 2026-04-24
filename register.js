// ============================================
//  register.js — Firebase Auth for
//  Mental Wellness Tracker
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAJlWRR3cm3ckpQ8SnGp40fvMrt_RZd5dI",
  authDomain: "mental-wellness-tracker-b85e4.firebaseapp.com",
  projectId: "mental-wellness-tracker-b85e4",
  storageBucket: "mental-wellness-tracker-b85e4.firebasestorage.app",
  messagingSenderId: "1059302688039",
  appId: "1:1059302688039:web:bfe4732ab7736b477f1502",
  measurementId: "G-JNV7R0LG4K"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ─────────────────────────────────────────────
// 📌 REGISTER a new user
// ─────────────────────────────────────────────
export async function registerUser(name, email, password) {
  try {
    // 1. Create the account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Save extra info (name) to Firestore under "users" collection
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    showMessage("✅ Account created! Welcome 🌿", "success");
    console.log("Registered user:", user.email);

    // 3. Redirect to main app after short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    // Show user-friendly error messages
    handleAuthError(error);
  }
}

// ─────────────────────────────────────────────
// 📌 LOGIN an existing user
// ─────────────────────────────────────────────
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    showMessage("✅ Logged in! Welcome back 🌿", "success");
    console.log("Logged in:", user.email);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    handleAuthError(error);
  }
}

// ─────────────────────────────────────────────
// 📌 LOGOUT the current user
// ─────────────────────────────────────────────
export async function logoutUser() {
  try {
    await signOut(auth);
    showMessage("👋 Logged out successfully.", "success");
    setTimeout(() => {
      window.location.href = "register.html";
    }, 1000);
  } catch (error) {
    showMessage("Error logging out: " + error.message, "error");
  }
}

// ─────────────────────────────────────────────
// 📌 CHECK if a user is already logged in
// Call this on every page to protect your app
// ─────────────────────────────────────────────
export function checkAuthState(onLoggedIn, onLoggedOut) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      console.log("Active user:", user.email);
      if (onLoggedIn) onLoggedIn(user);
    } else {
      // No user logged in
      console.log("No user logged in.");
      if (onLoggedOut) onLoggedOut();
    }
  });
}

// ─────────────────────────────────────────────
// 🛠️ HELPER: Show friendly error messages
// ─────────────────────────────────────────────
function handleAuthError(error) {
  const messages = {
    "auth/email-already-in-use":   "⚠️ This email is already registered. Try logging in.",
    "auth/invalid-email":          "⚠️ Please enter a valid email address.",
    "auth/weak-password":          "⚠️ Password must be at least 6 characters.",
    "auth/user-not-found":         "⚠️ No account found with this email.",
    "auth/wrong-password":         "⚠️ Incorrect password. Please try again.",
    "auth/too-many-requests":      "⚠️ Too many attempts. Please wait a moment.",
    "auth/network-request-failed": "⚠️ Network error. Check your internet connection."
  };
  const msg = messages[error.code] || ("⚠️ Error: " + error.message);
  showMessage(msg, "error");
  console.error("Auth error:", error.code, error.message);
}

// ─────────────────────────────────────────────
// 🛠️ HELPER: Show a message on the page
// Looks for an element with id="authMsg"
// ─────────────────────────────────────────────
function showMessage(text, type) {
  const el = document.getElementById("authMsg");
  if (!el) return;
  el.innerText = text;
  el.style.color = type === "success" ? "#5a7d5a" : "#c0392b";
  el.style.opacity = "1";

  if (type === "success") {
    setTimeout(() => { el.style.opacity = "0"; }, 3000);
  }
}