// components/home/AdvisoryTicker.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdvisoryTicker({ items = [] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Advisories</Text>
      {items.map((t, i) => (
        <Text key={i} style={styles.line}>• {t}</Text>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141518", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#24262b", marginTop: 12,
  },
  title: { color: "#fff", fontWeight: "700", marginBottom: 6 },
  line: { color: "#cfcfcf", marginTop: 2 },
});
