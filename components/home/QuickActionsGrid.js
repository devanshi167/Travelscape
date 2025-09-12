// components/home/QuickActionsGrid.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Item = ({ label, onPress }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress}>
    <Text style={styles.tileTxt}>{label}</Text>
  </TouchableOpacity>
);

export default function QuickActionsGrid({ onShowID, onShare, onHelpline, onSettings }) {
  return (
    <View style={styles.grid}>
      <Item label="Show ID" onPress={onShowID} />
      <Item label="Share Location" onPress={onShare} />
      <Item label="Helpline" onPress={onHelpline} />
      <Item label="Settings" onPress={onSettings} />
    </View>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  tile: {
    width: "48%", height: 56, borderRadius: 12, backgroundColor: "#1b1c1f",
    borderWidth: 1, borderColor: "#292a2f", alignItems: "center", justifyContent: "center",
  },
  tileTxt: { color: "#ffcc00", fontWeight: "700" },
});
