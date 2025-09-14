import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  const handleSignup = async () => {
    try {
      // Validate required fields
      if (!name || !aadharNumber || !contactNumber || !address || !gender || !age || !email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      // Validate Aadhar number (12 digits)
      if (aadharNumber.length !== 12) {
        Alert.alert("Error", "Aadhar number must be 12 digits");
        return;
      }

      // Validate contact number (10 digits)
      if (contactNumber.length !== 10) {
        Alert.alert("Error", "Contact number must be 10 digits");
        return;
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("DB instance:", db);
      console.log("User ID:", userCredential.user.uid);

      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        aadharNumber,
        contactNumber,
        address,
        gender,
        age,
        email,
        createdAt: new Date().toISOString()
      });

      console.log("User data stored with ID:", userCredential.user.uid);

      Alert.alert("Signup Successful", "Now you can login.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Aadhar Number"
          placeholderTextColor="#aaa"
          value={aadharNumber}
          onChangeText={setAadharNumber}
          style={styles.input}
          keyboardType="numeric"
          maxLength={12}
        />

        <TextInput
          placeholder="Contact Number"
          placeholderTextColor="#aaa"
          value={contactNumber}
          onChangeText={setContactNumber}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TextInput
          placeholder="Address"
          placeholderTextColor="#aaa"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          multiline
        />

        <TextInput
          placeholder="Gender"
          placeholderTextColor="#aaa"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
        />

        <TextInput
          placeholder="Age"
          placeholderTextColor="#aaa"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          keyboardType="numeric"
          maxLength={3}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkHighlight}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f2027",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "#1c1c1e",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    backgroundColor: "#2c2c2e",
    color: "white",
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffcc00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
  },
  linkHighlight: {
    color: "#ffcc00",
    fontWeight: "600",
  },
});
