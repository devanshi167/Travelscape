import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";

const { width } = Dimensions.get("window");
const logoImg = require("../assets/logo1.png"); // same logo as before

export default function LandingPage({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={logoImg} style={styles.logo} />

      <Text style={styles.title}>TravelScape</Text>
      <Text style={styles.subtitle}>
        Explore the world with seamless travel planning and tickets at your fingertips.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Your adventure starts here ✈️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f2027",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    color: "#ffcc00",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    width: "80%",
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  loginText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  signupButton: {
    width: "80%",
    borderWidth: 2,
    borderColor: "#ffcc00",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  signupText: {
    color: "#ffcc00",
    fontWeight: "bold",
    fontSize: 18,
  },
  footer: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 30,
    textAlign: "center",
  },
});
