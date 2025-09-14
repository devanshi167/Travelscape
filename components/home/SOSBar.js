// components/home/SOSBar.js
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location';

export default function SOSBar({ onPanic, onToggleShare }) {
  const [sharing, setSharing] = useState(true);
  const holdRef = useRef(null);

  const handleSOS = async () => {
    try {
      // Get current user
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "You must be logged in to use SOS feature");
        return;
      }

      // Get current location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Error", "Location permission is required for SOS");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Get Firestore instance
      const db = getFirestore();
      
      // Create a document reference with user ID as the document ID
      const sosRef = doc(db, "SOS", user.uid);
      
      // Set the SOS document with user ID as document ID
      await setDoc(sosRef, {
        userId: user.uid,
        userName: user.displayName || user.email,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(),
        isActive: true
      }, { merge: true }); // Using merge: true to update existing document if it exists

      onPanic?.();
      Alert.alert("SOS Sent", "Emergency services and contacts have been notified of your location.");
    } catch (error) {
      console.error("SOS Error:", error);
      Alert.alert("Error", "Failed to send SOS. Please try again.");
    }
  };

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={handleSOS}
        delayLongPress={1200}
        style={styles.sos}
      >
        <Text style={styles.sosText}>HOLD FOR SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.share, sharing && { borderColor: "#ffcc00" }]}
        onPress={() => {
          const next = !sharing;
          setSharing(next);
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
    height: 70, borderRadius: 16, backgroundColor: "#ff3b3b",
    alignItems: "center", justifyContent: "center",
  },
  sosText: { color: "#000", fontWeight: "800", letterSpacing: 1 },
  share: {
    height: 44, borderRadius: 12, borderWidth: 1, borderColor: "#333",
    alignItems: "center", justifyContent: "center", backgroundColor: "#1b1b1d",
  },
  shareText: { color: "#e6e6e6", fontWeight: "600" },
});
