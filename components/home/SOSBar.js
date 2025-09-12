// components/home/SOSBar.js
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function SOSBar({ onPanic, onToggleShare }) {
  const [sharing, setSharing] = useState(true);
  const holdRef = useRef(null);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={() => {
          onPanic?.();
          Alert.alert("SOS Sent", "Nearest unit & contacts alerted.");
        }}
        delayLongPress={1200}
        style={styles.sos}
      >
        <Text style={styles.sosText}>HOLD FOR SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.share, sharing && { borderColor: "#ffcc00" }]}
        onPress={() => {
          const next = !sharing;
          setSharing(next);
          onToggleShare?.(next);
        }}
      >
        <Text style={styles.shareText}>
          {sharing ? "Live Location: ON" : "Live Location: OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { padding: 16, gap: 12, backgroundColor: "#111" },
  sos: {
    height: 70, borderRadius: 16, backgroundColor: "#ff3b3b",
    alignItems: "center", justifyContent: "center",
  },
  sosText: { color: "#000", fontWeight: "800", letterSpacing: 1 },
  share: {
    height: 44, borderRadius: 12, borderWidth: 1, borderColor: "#333",
    alignItems: "center", justifyContent: "center", backgroundColor: "#1b1b1d",
  },
  shareText: { color: "#e6e6e6", fontWeight: "600" },
});
