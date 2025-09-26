import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ilkinsehife from "../Screens/auth/ilkinsehife";
import Signup from "../Screens/auth/signup";
import Login from "../Screens/auth/login";
import Sifreniunutdum from "../Screens/auth/sifreniunutdum";
import { Dilsec } from "../Screens/auth/dilsecimi";
import Cumebildirisi from "../Screens/auth/cumebildirisi";
import Cinssec from "../Screens/auth/cinssec";
import Emailverify from "../Screens/auth/emailiverify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import Mescidsec from "../Screens/auth/mosque";

const Stack = createNativeStackNavigator();

const Authnavigation = () => {
  const [email, setEmail] = useState("");
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLastScreen = async () => {
      const lastScreen = await AsyncStorage.getItem("LAST_SCREEN");
      if (lastScreen) {
        setInitialRoute(lastScreen);
        console.log(lastScreen)
      } else {
        setInitialRoute("ilkinsehife");
      }
      setLoading(false);
    };
    loadLastScreen();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }
  // if(!initialRoute) return null

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="dilsec"
        component={Dilsec}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ilkinsehife"
        component={Ilkinsehife}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="verifyemail"
        component={Emailverify}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sifreniunutdum"
        component={Sifreniunutdum}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="cumebildirisi"
        component={Cumebildirisi}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="cinssec"
        component={Cinssec}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="mescidsec"
        component={Mescidsec}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Authnavigation;
