// components/home/GeoFenceBanner.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GeoFenceBanner({ status = "safe" }) {
  const palette = {
    safe: { bg: "#142316", text: "#19c37d", msg: "You are in a safe zone." },
    watch: { bg: "#2a230f", text: "#ffcc00", msg: "Caution: Sensitive area nearby." },
    restricted: { bg: "#2a1515", text: "#ff6b6b", msg: "Restricted zone! Please turn back." },
  }[status];

  return (
    <View style={[styles.banner, { backgroundColor: palette.bg }]}>
      <Text style={[styles.txt, { color: palette.text }]}>{palette.msg}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  banner: { padding: 12, borderRadius: 12, marginTop: 12 },
  txt: { fontWeight: "700" },
});
