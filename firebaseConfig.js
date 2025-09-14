// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfrp_3IKm310vP9qJNUx8-7gZ-vO5WdHc",
  authDomain: "travelscape-4733e.firebaseapp.com",
  projectId: "travelscape-4733e",
  storageBucket: "travelscape-4733e.firebasestorage.app",
  messagingSenderId: "771365553321",
  appId: "1:771365553321:web:9f72eec8aab368b4d8d5b8",
  measurementId: "G-WBZ3YEC837"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);
// console.log("Firebase initialized:", db);