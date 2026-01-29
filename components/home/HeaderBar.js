// components/home/HeaderBar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderBar({ user, onSettings }) {
  return (
    <View style={styles.bar}>
      <View>
        <Text style={styles.hello}>Hi, {user?.name || "Traveler"} 👋</Text>
        <Text style={styles.sub}>Stay safe & enjoy your trip</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.lang}>
          <Text style={styles.langText}>{user?.lang || "EN"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSettings}>
          <Ionicons name="settings-outline" size={22} color="#bdbdbd" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: "#111", flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
  },
  hello: { color: "#fff", fontSize: 20, fontWeight: "700" },
  sub: { color: "#9aa0a6", marginTop: 2 },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
  lang: {
    backgroundColor: "#1e1f22", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1, borderColor: "#2b2c30",
  },
  langText: { color: "#e6e6e6", fontWeight: "600" },
});