// components/home/TripTimeline.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TripTimeline({ items = [] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today’s Plan</Text>
      {items.map((it, idx) => (
        <View key={idx} style={styles.row}>
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.item}>{it.t}</Text>
            <Text style={styles.meta}>{it.day} • {it.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#17181b", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#26272b", marginTop: 12,
  },
  title: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#ffcc00" },
  item: { color: "#e6e6e6", fontWeight: "600" },
  meta: { color: "#9aa0a6", marginTop: 2 },
});
