// screens/Home.js
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import HeaderBar from "../components/home/HeaderBar";
import SOSBar from "../components/home/SOSBar";
import DigitalIDCard from "../components/home/DigitalIDCard";
import SafetyScoreCard from "../components/home/SafetyScoreCard";
import GeoFenceBanner from "../components/home/GeoFenceBanner";
import TripTimeline from "../components/home/TripTimeline";
import NearbyRiskCard from "../components/home/NearbyRiskCard";
import AdvisoryTicker from "../components/home/AdvisoryTicker";
import QuickActionsGrid from "../components/home/QuickActionsGrid";
import LiveLocationCard from "../components/home/LiveLocationCard";
import ConsentBanner from "../components/home/ConsentBanner";
import FooterBar from "../components/home/FooterBar";
import * as Location from "expo-location";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Home({ navigation }) {
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("safe"); // "safe" | "watch" | "restricted"
  const [score, setScore] = useState(82); // mock safety score
  const [trip, setTrip] = useState([
    { t: "Hotel Check-in", time: "10:00", day: "Fri" },
    { t: "City Museum", time: "12:30", day: "Fri" },
    { t: "Hill View Point", time: "16:00", day: "Fri" },
  ]);
  const user = { name: "Riya", lang: "EN" };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "You have been logged out successfully.");
      // App.js's onAuthStateChanged will switch to the public stack automatically
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });

      // TODO: Evaluate geofence and set status accordingly
      // setGeoStatus("watch" | "restricted")
    })();
  }, []);

  return (
    <View style={styles.wrap}>
      <StatusBar barStyle="light-content" />
      <HeaderBar user={user} onSettings={() => navigation.navigate("Signup")} />

      {/* Floating Logout button (top-right) */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>

      <SOSBar
        onPanic={() => {
          // TODO: write panic event to Firestore + trigger CF notification
        }}
        onToggleShare={(val) => {
          // TODO: store live-tracking opt-in in Firestore
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <GeoFenceBanner status={geoStatus} />
        <View style={styles.row}>
          <DigitalIDCard
            name="Riya Sharma"
            country="IN"
            valid="12–18 Sep"
            onShowQR={() => {}}
            onVerify={() => {}}
          />
          <SafetyScoreCard score={score} />
        </View>

        <QuickActionsGrid
          onShowID={() => {}}
          onShare={() => {}}
          onHelpline={() => {}}
          onSettings={() => {}}
        />

        <LiveLocationCard coords={coords} />
        <NearbyRiskCard level="Medium" distanceKm={1.7} tag="Crowd" />
        <TripTimeline items={trip} />
        <AdvisoryTicker
          items={[
            "Heavy rain expected after 6 PM.",
            "Avoid Riverfront trail after dark.",
            "Keep ID QR handy at checkpoints.",
          ]}
        />
        <ConsentBanner trackingEnabled={true} onToggle={(v) => {}} onPolicy={() => {}} />
        <FooterBar />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#0b0b0c" },
  content: { padding: 16, paddingBottom: 32 },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  logoutBtn: {
    position: "absolute",
    top: 58, // sits under HeaderBar’s safe area padding
    right: 16,
    zIndex: 50,
    backgroundColor: "#ff3b3b",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#b32a2a",
  },
  logoutTxt: { color: "#fff", fontWeight: "700" },
});
