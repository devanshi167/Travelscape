// components/home/NearbyRiskCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NearbyRiskCard({ level = "Low", distanceKm = 0.6, tag = "General" }) {
  const color = level === "High" ? "#ff6b6b" : level === "Medium" ? "#ffcc00" : "#19c37d";
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nearby Risk</Text>
      <Text style={[styles.level, { color }]}>{level}</Text>
      <Text style={styles.meta}>{tag} • {distanceKm} km away</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#17181b", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#26272b", marginTop: 12,
  },
  title: { color: "#fff", fontWeight: "700" },
  level: { fontSize: 22, fontWeight: "800", marginTop: 6 },
  meta: { color: "#9aa0a6", marginTop: 2 },
});
