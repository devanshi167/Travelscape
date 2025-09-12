// components/home/FooterBar.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FooterBar() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.txt}>TravelScape • v0.1 • © 2025</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: 20 },
  txt: { color: "#6f7277" },
});
