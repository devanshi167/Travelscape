// components/home/SOSBar.js
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";

let locationInterval = null; // interval reference

export default function SOSBar({ onPanic, onToggleShare }) {
  const [sharing, setSharing] = useState(false);

  // ---------------- SOS HANDLER ----------------
  const handleSOS = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "You must be logged in to use SOS feature");
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Location permission is required for SOS");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const db = getFirestore();
      const sosRef = doc(db, "SOS", user.uid);

      await setDoc(
        sosRef,
        {
          userId: user.uid,
          userName: user.displayName || user.email,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date(),
          isActive: true,
        },
        { merge: true }
      );

      onPanic?.();
      Alert.alert("SOS Sent", "Emergency services and contacts have been notified of your location.");
    } catch (error) {
      console.error("SOS Error:", error);
      Alert.alert("Error", "Failed to send SOS. Please try again.");
    }
  };

  // ---------------- SAVE LOCATION TO FIRESTORE ----------------
  const saveLocation = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        return;
      }

      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        if (Platform.OS === "android") {
          IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
          );
        } else {
          Alert.alert("Enable GPS", "Please enable Location in iOS Settings.");
        }
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const db = getFirestore();
      const ref = doc(db, "LiveLocations", user.uid);

      await setDoc(
        ref,
        {
          userId: user.uid,
          userName: user.displayName || user.email,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: new Date(),
        },
        { merge: true }
      );

      console.log("Live location saved:", loc.coords);
      Alert.alert("📍 Location Shared", `Your location was updated at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error("Error saving location:", err);
    }
  };

  // ---------------- TOGGLE LIVE LOCATION ----------------
  const toggleLiveLocation = async (enable) => {
    if (enable) {
      Alert.alert(
        "Share Location",
        "Your location will be shared every 10 minutes. Do you agree?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: async () => {
              console.log("User declined auto-sharing");
              await saveLocation(); // Just save once
            },
          },
          {
            text: "Yes",
            onPress: async () => {
              console.log("User accepted auto-sharing");
              await saveLocation(); // Save immediately
              // Set interval for every 10 minutes
              locationInterval = setInterval(saveLocation, 10 * 60 * 1000);
            },
          },
        ]
      );
    } else {
      // Stop auto updates
      if (locationInterval) {
        clearInterval(locationInterval);
        locationInterval = null;
      }
      console.log("Live location tracking stopped.");
    }
  };

  // ---------------- UI ----------------
  return (
    <View style={styles.wrap}>
      {/* SOS button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={handleSOS}
        delayLongPress={1200}
        style={styles.sos}
      >
        <Text style={styles.sosText}>HOLD FOR SOS</Text>
      </TouchableOpacity>

      {/* Live location toggle */}
      <TouchableOpacity
        style={[styles.share, sharing && { borderColor: "#ffcc00" }]}
        onPress={async () => {
          const next = !sharing;
          setSharing(next);
          await toggleLiveLocation(next);
          onToggleShare?.(next);
        }}
      >
        <Text style={styles.shareText}>
          {sharing ? "Live Location: ON" : "Live Location: OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12, backgroundColor: "#111" },
  sos: {
    height: 70,
    borderRadius: 16,
    backgroundColor: "#ff3b3b",
    alignItems: "center",
    justifyContent: "center",
  },
  sosText: { color: "#000", fontWeight: "800", letterSpacing: 1 },
  share: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b1b1d",
  },
  shareText: { color: "#e6e6e6", fontWeight: "600" },
});
