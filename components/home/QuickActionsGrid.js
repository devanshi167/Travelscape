// components/home/QuickActionsGrid.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native";
import * as Location from "expo-location";

const Item = ({ label, onPress }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress}>
    <Text style={styles.tileTxt}>{label}</Text>
  </TouchableOpacity>
);

export default function QuickActionsGrid({ onShowID, onHelpline, onSettings }) {
  // Function to share live location
  const handleShareLocation = async () => {
    try {
      // Ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission not granted");
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Create Google Maps link
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Open native share sheet
      await Share.share({
        message: `📍 Here's my location: ${mapsUrl}`,
        url: mapsUrl, // iOS uses this too
      });
    } catch (err) {
      console.error("Error sharing location:", err);
    }
  };

  return (
    <View style={styles.grid}>
      <Item label="Show ID" onPress={onShowID} />
      <Item label="Share Location" onPress={handleShareLocation} />
      <Item label="Helpline" onPress={onHelpline} />
      <Item label="Settings" onPress={onSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  tile: {
    width: "48%",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#1b1c1f",
    borderWidth: 1,
    borderColor: "#292a2f",
    alignItems: "center",
    justifyContent: "center",
  },
  tileTxt: { color: "#ffcc00", fontWeight: "700" },
});
