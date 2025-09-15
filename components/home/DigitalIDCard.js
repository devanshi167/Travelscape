import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from "react-native";
import { buildVC, verifyVC, anchorVC } from "../../utils/aadhar";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import QRCode from "react-native-qrcode-svg";

export default function DigitalIDCard() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [touristId, setTouristId] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  // 🔹 Check if tourist ID already saved in Firestore
  useEffect(() => {
    const fetchTouristId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().touristId) {
        setVerified(true);
        setTouristId(snap.data().touristId);
      }
    };
    fetchTouristId();
  }, []);

  const handleVerify = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        Alert.alert("Error", "User data not found.");
        return;
      }

      const userData = snap.data();
      const vc = buildVC(userData);

      // 1. Try verifying on blockchain
      const { ok, ts } = await verifyVC(vc);

      let hash;
      if (ok) {
        hash = "0x" + require("crypto-js").SHA256(JSON.stringify(vc)).toString();
        Alert.alert("✅ Verified", "Tourist ID already exists.\nAnchored at: " + new Date(ts * 1000).toLocaleString());
      } else {
        // 2. If not found, anchor
        hash = await anchorVC(vc);
        Alert.alert("🎉 Tourist ID Created", "Your Digital ID has been anchored.\nHash: " + hash);
      }

      // 3. Save in Firestore so we don’t repeat
      await updateDoc(doc(db, "users", user.uid), { touristId: hash });

      setVerified(true);
      setTouristId(hash);
    } catch (err) {
      console.error("Verify error:", err);
      Alert.alert("Error", "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Digital ID</Text>

      {verified ? (
        <>
          <Text style={[styles.meta, { color: "#19c37d", fontWeight: "700" }]}>✅ ID Verified</Text>
          <Text style={[styles.meta, { fontSize: 12, marginTop: 4 }]}>
            Tourist ID: {touristId?.slice(0, 10)}...{touristId?.slice(-6)}
          </Text>
        </>
      ) : (
        <Text style={styles.meta}>Click Verify to generate on-chain ID</Text>
      )}

      <View style={styles.row}>
        {/* Show QR only if ID is verified */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            if (!touristId) {
              Alert.alert("Not Ready", "Please verify ID first.");
              return;
            }
            setShowQR(true);
          }}
        >
          <Text style={styles.btnText}>Show QR</Text>
        </TouchableOpacity>

        {/* Verify button only if not already verified */}
        {!verified && (
          <TouchableOpacity
            style={[styles.btn, styles.outline]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={[styles.btnText, { color: "#ffcc00" }]}>
              {loading ? "Verifying..." : "Verify on-chain"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* QR Code Popup */}
      <Modal visible={showQR} transparent animationType="fade" onRequestClose={() => setShowQR(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ color: "#fff", fontWeight: "700", marginBottom: 12 }}>
              Tourist ID QR
            </Text>
            <QRCode value={touristId || "No ID"} size={200} backgroundColor="white" />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowQR(false)}>
              <Text style={{ color: "#000", fontWeight: "700" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#17181b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#26272b",
  },
  title: { color: "#9aa0a6", fontSize: 12 },
  meta: { color: "#c7c7c7", marginTop: 2 },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: {
    flex: 1,
    backgroundColor: "#ffcc00",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  btnText: { color: "#000", fontWeight: "800" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ffcc00",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  closeBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffcc00",
    borderRadius: 10,
  },
});
