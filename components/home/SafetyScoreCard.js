// components/home/SafetyScoreCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SafetyScoreCard({ score = 80 }) {
  const label = score >= 85 ? "Safe" : score >= 70 ? "Moderate" : "Caution";
  const color = score >= 85 ? "#19c37d" : score >= 70 ? "#ffcc00" : "#ff6b6b";
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Safety Score</Text>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={styles.caption}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    width: 130, backgroundColor: "#17181b", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#26272b", alignItems: "center",
  },
  title: { color: "#9aa0a6", fontSize: 12 },
  score: { fontSize: 34, fontWeight: "800", marginTop: 6 },
  caption: { color: "#c7c7c7", marginTop: 2 },
});
