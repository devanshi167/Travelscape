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
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyC9oFpzScVaBy24p3Gki4lwu0vHmTqKCdc");

export default function Home({ navigation }) {
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("safe"); // "safe" | "watch" | "restricted"
  const [userData, setUserData] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherAdvisory, setWeatherAdvisory] = useState(null);

  const generateAdvisories = async (weatherData) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `You are a travel safety advisor. Based on the following weather conditions, generate exactly 3 short, specific travel safety advisories.
      Current conditions:
      - Temperature: ${weatherData.temperature}°C
      - Weather: ${weatherData.condition?.description || 'Unknown'}
      - Time: ${new Date().toLocaleTimeString()}
      
      Return ONLY a simple array of 3 strings in this exact format:
      ["advisory 1", "advisory 2", "advisory 3"]
      
      Each advisory should be a clear, actionable safety tip related to the current weather and time.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up the response to ensure it's valid JSON
      if (!text.startsWith('[')) {
        text = text.substring(text.indexOf('['));
      }
      if (!text.endsWith(']')) {
        text = text.substring(0, text.lastIndexOf(']') + 1);
      }
      
      try {
        const advisories = JSON.parse(text);
        if (Array.isArray(advisories) && advisories.length > 0) {
          setWeatherAdvisory(advisories);
        } else {
          throw new Error('Invalid advisory format');
        }
      } catch (jsonError) {
        // If JSON parsing fails, extract advisories using regex
        const matches = text.match(/"([^"]+)"/g);
        if (matches) {
          const advisories = matches.map(m => m.replace(/"/g, ''));
          setWeatherAdvisory(advisories);
        } else {
          throw new Error('Could not parse advisories');
        }
      }
    } catch (error) {
      console.error("Error generating advisories:", error);
      // Fallback advisories based on weather conditions
      const fallbackAdvisories = [];
      
      // Temperature-based advisories
      if (weatherData.temperature > 30) {
        fallbackAdvisories.push("High temperature - Stay hydrated and seek shade");
      } else if (weatherData.temperature < 10) {
        fallbackAdvisories.push("Cold conditions - Dress in warm layers");
      }
      
      // Weather condition-based advisories
      const condition = (weatherData.condition?.description || '').toLowerCase();
      if (condition.includes('rain')) {
        fallbackAdvisories.push("Rainy conditions - Carry an umbrella and watch your step");
      } else if (condition.includes('cloud')) {
        fallbackAdvisories.push("Overcast conditions - Be visible in low light");
      } else if (condition.includes('clear')) {
        fallbackAdvisories.push("Sunny conditions - Use sun protection");
      }
      
      // Add a general safety advisory
      fallbackAdvisories.push("Stay aware of your surroundings and follow local guidelines");
      
      setWeatherAdvisory(fallbackAdvisories);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const query = `${latitude},${longitude}`;
      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setWeather(data);
      
      // Generate AI-powered advisories based on weather data
      if (data) {
        await generateAdvisories(data);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherAdvisory([
        "Stay aware of weather conditions",
        "Keep emergency contacts updated",
        "Follow local safety guidelines"
      ]);
    }
  };
  const [score, setScore] = useState(82); // mock safety score
  const [trip, setTrip] = useState([
    { t: "Hotel Check-in", time: "10:00", day: "Fri" },
    { t: "City Museum", time: "12:30", day: "Fri" },
    { t: "Hill View Point", time: "16:00", day: "Fri" },
  ]);

  // Function to fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No authenticated user found");
        return;
      }

      if (!db) {
        throw new Error("Firestore instance not initialized");
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      if (!userDocRef) {
        throw new Error("Could not create document reference");
      }

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.log("No user data found for ID:", currentUser.uid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(
        "Error",
        "Could not fetch user data. Please try logging in again."
      );
      Alert.alert("Error", "Failed to fetch user data");
    }
  };

  const fetchAdvisories = async () => {
    try {
      // Get current location-based advisories
      const advisoriesRef = collection(db, "advisories");
      const q = query(
        advisoriesRef,
        where("active", "==", true),
        where("expiresAt", ">", new Date()),
        orderBy("expiresAt"),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      const activeAdvisories = [];
      
      querySnapshot.forEach((doc) => {
        const advisory = doc.data();
        activeAdvisories.push(advisory.message);
      });

      setAdvisories(activeAdvisories);
    } catch (error) {
      console.error("Error fetching advisories:", error);
    }
  };

  // const fetchWeatherAdvisory = async () => {
  //   try {
  //     if (coords) {
  //       // Using OpenWeatherMap API for weather data
  //       const response = await fetch(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=YOUR_API_KEY&units=metric`
  //       );
  //       const data = await response.json();
        
  //       // Create weather advisory based on conditions
  //       if (data.weather && data.weather[0]) {
  //         const condition = data.weather[0].main.toLowerCase();
  //         const temp = data.main.temp;
          
  //         let advisory = "";
  //         if (condition.includes("rain")) {
  //           advisory = `${data.weather[0].description} expected. Carry an umbrella.`;
  //         } else if (condition.includes("storm")) {
  //           advisory = "Thunderstorm warning. Stay indoors if possible.";
  //         } else if (temp > 35) {
  //           advisory = "High temperature alert. Stay hydrated.";
  //         } else if (temp < 10) {
  //           advisory = "Cold weather alert. Dress warmly.";
  //         }
          
  //         if (advisory) {
  //           setWeatherAdvisory(advisory);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching weather:", error);
  //   }
  // };

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
      // Fetch user data
      await fetchUserData();

      // Get location permissions and coordinates
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is needed for weather updates");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  // Separate useEffect for weather data since it depends on coords
  useEffect(() => {
    if (coords) {
      fetchWeatherData(coords.lat, coords.lng);
    }
  }, [coords]);

  return (
    <View style={styles.wrap}>
      <StatusBar barStyle="light-content" />
      <HeaderBar 
        user={{ 
          name: userData?.name || "Traveler",
          lang: "EN"
        }} 
        onSettings={handleLogout}
      />

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
            name={userData?.name || "Loading..."}
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
          items={weatherAdvisory || [
            "Loading travel advisories...",
            "Stay alert and follow local guidelines",
            "Keep emergency contacts updated"
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
