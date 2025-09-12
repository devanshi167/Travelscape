// SplashScreenView.js
import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";


export default function SplashScreenView({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // call parent to hide splash
    }, 2500); // 2.5s delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo1.png")} style={styles.logo} />
      <Text style={styles.title}>TravelScape</Text>
      <ActivityIndicator size="large" color="#ff9900" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    color: "white",
    fontSize: 26,
    marginTop: 15,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});
