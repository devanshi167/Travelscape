// components/home/ConsentBanner.js
import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";

export default function ConsentBanner({ trackingEnabled, onToggle, onPolicy }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Privacy & Consent</Text>
      <Text style={styles.meta}>
        Share live location with family & law enforcement when SOS triggers.
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Live Tracking</Text>
        <Switch value={trackingEnabled} onValueChange={onToggle} />
      </View>
      <TouchableOpacity onPress={onPolicy}>
        <Text style={styles.link}>View Data Policy</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141518", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#24262b", marginTop: 12,
  },
  title: { color: "#fff", fontWeight: "700" },
  meta: { color: "#bdbdbd", marginTop: 6 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  label: { color: "#e6e6e6", fontWeight: "600" },
  link: { color: "#ffcc00", marginTop: 10, fontWeight: "700" },
});