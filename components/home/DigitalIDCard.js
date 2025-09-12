// components/home/DigitalIDCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DigitalIDCard({ name, country, valid, onShowQR, onVerify }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Digital ID</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.meta}>Country: {country} • Valid: {valid}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={onShowQR}>
          <Text style={styles.btnText}>Show QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.outline]} onPress={onVerify}>
          <Text style={[styles.btnText, { color: "#ffcc00" }]}>Verify on-chain</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: "#17181b", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#26272b",
  },
  title: { color: "#9aa0a6", fontSize: 12 },
  name: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 4 },
  meta: { color: "#c7c7c7", marginTop: 2 },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: {
    flex: 1, backgroundColor: "#ffcc00", borderRadius: 10,
    alignItems: "center", justifyContent: "center", height: 40,
  },
  btnText: { color: "#000", fontWeight: "800" },
  outline: {
    backgroundColor: "transparent", borderWidth: 1, borderColor: "#ffcc00",
  },
});
