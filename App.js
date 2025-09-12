// Optional (usually safe with Expo; keep at very top if you see gesture errors):
// import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StatusBar, ActivityIndicator, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPage from './components/LandingPage';   // ⬅️ no space
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './screens/Home';                     // ⬅️ create this screen if not already

import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const logoImg = require('./assets/logo1.png');
const Stack = createNativeStackNavigator();

export default function App() {
  const [booting, setBooting] = useState(true);   // splash timer
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Splash timer
    const timer = setTimeout(() => setBooting(false), 3800);

    // Firebase auth listener (persistence via AsyncStorage already set in firebaseConfig)
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  // Show splash until BOTH: timer done & auth state known
  if (booting || !authReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.title}>TravelScape</Text>
        <ActivityIndicator size="large" color="#ffcc00" style={{ marginTop: 20 }} />
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('./assets/travel tickets.json')}
            autoPlay
            loop
            style={{ width: '100%', height: 200 }}
          />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' }, // dark theme base
        }}
      >
        {user ? (
          // If logged in, land on Home
          <Stack.Screen name="Home" component={Home} />
        ) : (
          // Else show public flow
          <>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 15 },
  lottieWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});
