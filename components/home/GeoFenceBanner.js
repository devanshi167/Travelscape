// components/home/GeoFenceBanner.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";

const GEOFENCE_RADIUS = 500; // meters

export default function GeoFenceBanner() {
  const [status, setStatus] = useState("safe");
  const [location, setLocation] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const mapRef = useRef(null);

  const palette = {
    safe: { bg: "#142316", text: "#19c37d", msg: "You are in a safe zone." },
    watch: { bg: "#2a230f", text: "#ffcc00", msg: "Caution: Sensitive area nearby." },
    restricted: { bg: "#2a1515", text: "#ff6b6b", msg: "Restricted zone! Please turn back." },
  }[status];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required for geofencing.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Load geofences from OpenStreetMap
      fetchGeofences(loc.coords);

      // Foreground watcher
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 20 },
        (locUpdate) => {
          setLocation(locUpdate);
          checkGeofences(locUpdate.coords);
        }
      );
    })();
  }, []);

  const fetchGeofences = async (coords) => {
    try {
      const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=police+near+${coords.latitude},${coords.longitude}`;
      const res = await fetch(queryUrl, { headers: { "User-Agent": "expo-geofence-demo" } });
      const data = await res.json();

      const fences = data.map((place) => ({
        identifier: place.display_name.split(",")[0],
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        radius: GEOFENCE_RADIUS,
        type: "restricted",
      }));

      setGeofences(fences);
    } catch (err) {
      console.error("Error fetching geofences:", err);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const checkGeofences = (coords) => {
    if (!geofences.length) return;
    let newStatus = "safe";

    geofences.forEach((f) => {
      const distance = getDistance(coords.latitude, coords.longitude, f.latitude, f.longitude);
      if (distance < f.radius) {
        newStatus = f.type || "watch";
      }
    });

    if (newStatus !== status) {
      setStatus(newStatus);
      if (newStatus === "restricted") {
        Alert.alert("⚠️ Warning", "You entered a restricted zone!");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { backgroundColor: palette.bg }]}>
        <Text style={[styles.txt, { color: palette.text }]}>{palette.msg}</Text>
      </View>

      {location && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />

            {geofences.map((f, i) => (
              <Circle
                key={i}
                center={{ latitude: f.latitude, longitude: f.longitude }}
                radius={f.radius}
                strokeWidth={2}
                strokeColor={f.type === "restricted" ? "#ff0000" : "#ffcc00"}
                fillColor={f.type === "restricted" ? "#ff000033" : "#ffcc0033"}
              />
            ))}
          </MapView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  banner: { padding: 12, borderRadius: 12, marginTop: 12 },
  txt: { fontWeight: "700" },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 12,
  },
  map: { width: "100%", height: "100%" },
});