import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Alert,
  AppState,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import tw from "twrnc";
import { API_URLS } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Emailverify({ route }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [code, setcode] = useState("");
  const [email, setEmail] = useState("");
  const appState = useRef(AppState.currentState);
  const verified = useRef(false);

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("lastemail");
      console.log("email:", email);
      if (storedEmail) setEmail(storedEmail);
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "background" && !verified.current) {
          await AsyncStorage.setItem("LAST_SCREEN", "verifyemail");
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleverify = async () => {
    try {
      const res = await axios.post(API_URLS.AUTH.VERIFY, {
        email,
        code,
      });

      Alert.alert("Uğurlu", "Doğrulama tamamlandı");
      await AsyncStorage.removeItem("LAST_SCREEN");
      console.log("Removed LAST_SCREEN");
      verified.current = true;
      navigation.navigate("cinssec");
    } catch (error) {
      console.log(error);
      Alert.alert("Xəta", error.response?.data?.hata || "Xəta baş verdi");
    }
  };

  const resendCode = async () => {
    if (!email) return;

    try {
      const res = await axios.post(API_URLS.AUTH.RESENDCODE, { email });
      Alert.alert(t("ugurlu"), t("kodyenidengonderildi"));
    } catch (error) {
      console.log(
        "Kod yenidən göndərmə xətası:",
        error.response?.data?.hata || error
      );
      Alert.alert(t("xeta"), t("kodgonderilemedi"));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, marginTop: insets.top + 15 }}>
          <View style={tw`flex items-center justify-center mt-3`}>
            <Image
              resizeMode="cover"
              style={tw`w-52 h-52`}
              source={require("../../../assets/mescid.png")}
            />
          </View>
          <View style={tw`flex items-center justify-center mt-2 px-4`}>
            <Text style={tw`text-center text-2xl font-semibold`}>
              {t("emailitesdiqet")}
            </Text>
          </View>
          <View style={tw`flex items-center justify-center mt-2 px-12`}>
            <Text style={tw`text-center text-lg font-normal text-gray-600`}>
              {t("gonderilenkoduyaz")}
            </Text>
          </View>
          <View style={tw`flex items-center justify-center mt-7`}>
            <TextInput
              keyboardType="numeric"
              style={tw`border-gray-300 w-[80%] h-12 border mb-3 rounded-md text-base px-3`}
              placeholder="Kod*"
              placeholderTextColor={"black"}
              value={code}
              onChangeText={(val) => setcode(val)}
            />
          </View>
          <TouchableOpacity
            onPress={resendCode}
            style={tw`flex items-center justify-center mt-3 mb-5`}
          >
            <Text style={tw`text-green-600`}>{t("yenidengonder")}</Text>
          </TouchableOpacity>
          {/* verifybutton */}
          <View style={tw`flex items-center justify-center mt-7`}>
            <TouchableOpacity
              onPress={handleverify}
              disabled={!code}
              style={tw`w-[88%] h-12 bg-green-600 rounded-md flex items-center justify-center mb-3 ${
                !code ? "opacity-50" : "opacity-100"
              }`}
            >
              <Text style={tw`text-white text-3xl font-semibold`}>
                {t("tesdiqet")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
