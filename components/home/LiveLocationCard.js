// components/home/LiveLocationCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LiveLocationCard({ coords }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Live Location</Text>
      {coords ? (
        <Text style={styles.meta}>
          Lat: {coords.lat.toFixed(5)}  •  Lng: {coords.lng.toFixed(5)}
        </Text>
      ) : (
        <Text style={styles.meta}>Permission needed / fetching…</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#17181b", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#26272b", marginTop: 12,
  },
  title: { color: "#fff", fontWeight: "700" },
  meta: { color: "#9aa0a6", marginTop: 6 },
});
