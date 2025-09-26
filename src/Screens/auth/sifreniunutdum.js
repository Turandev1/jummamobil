import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  AppState,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { API_URLS } from "../../config/api";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Sifreniunutdum() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(null); // null ile başlat
  const [loadingStep, setLoadingStep] = useState(true);

  const [form, setForm] = useState({
    newpassword: "",
    confirmpassword: "",
  });

  const [newPassShown, setNewPassShown] = useState(false);
  const [confirmPassShown, setConfirmPassShown] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // AsyncStorage'dan step ve email yükleme
  useEffect(() => {
    const loadStep = async () => {
      try {
        const savedStep = await AsyncStorage.getItem("LAST_STEP");
        const savedEmail = await AsyncStorage.getItem("FORGOT_EMAIL");
        if (savedEmail) setEmail(savedEmail);
        setStep(savedStep ? Number(savedStep) : 1);
      } catch (e) {
        console.log("Step yüklenirken hata:", e);
        setStep(1);
      } finally {
        setLoadingStep(false);
      }
    };
    loadStep();
  }, []);

  // Step değiştiğinde AsyncStorage'a kaydet
  useEffect(() => {
    if (step !== null) {
      AsyncStorage.setItem("LAST_STEP", step.toString());
    }
  }, [step]);

  // AppState ile arka plana geçince ekran ve step kaydet
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (appState.current.match(/active/) && nextAppState === "background") {
          if (step !== null) {
            await AsyncStorage.setItem("LAST_SCREEN", "sifreniunutdum");
            await AsyncStorage.setItem("LAST_STEP", step.toString());
            await AsyncStorage.setItem("FORGOT_EMAIL", email);
          }
        }
        appState.current = nextAppState;
      }
    );

    return () => subscription.remove();
  }, [step, email]);

  // Şifre sıfırlama kodunu gönder
  const sendForgotCode = async () => {
    if (!email) return;
    try {
      await axios.post(API_URLS.AUTH.FORGOTPASSSENDCODE, { email });
      await AsyncStorage.setItem("FORGOT_EMAIL", email);
      setStep(2);
    } catch (error) {
      console.log("Kod gönderilirken hata:", error.response?.message || error);
      Alert.alert(t("xeta"), t("kodgonderilemedi"));
    }
  };

  // Kod doğrulama
  const verifyCode = async () => {
    try {
      await axios.post(API_URLS.AUTH.FORGOTPASSVERIFY, { email, code });
      Alert.alert(t("ugurlu"), t("koddogru"));
      setStep(3);
    } catch (error) {
      console.log("Kod doğrulama hatası:", error.response?.message || error);
      Alert.alert(t("xeta"), t("kodyanlis"));
    }
  };

  // Şifre değiştirme
  const changePassword = async () => {
    if (form.newpassword !== form.confirmpassword) {
      Alert.alert(t("xeta"), t("sifreleruygundeyil"));
      return;
    }

    try {
      await axios.post(API_URLS.AUTH.FORGOTPASSCHANGE, {
        newpassword: form.newpassword,
        email,
      });
      await AsyncStorage.removeItem("LAST_SCREEN");
      await AsyncStorage.removeItem("LAST_STEP");
      await AsyncStorage.removeItem("FORGOT_EMAIL");
      Alert.alert(t("ugurlu"), t("sifredeyisdi"));
      navigation.navigate("ilkinsehife");
    } catch (error) {
      console.log("Şifre değiştirme hatası:", error.response?.message || error);
      Alert.alert(t("xeta"), t("sifredeyismedi"));
    }
  };

  if (loadingStep || step === null) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginTop: insets.top + 15 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("ilkinsehife")}
        style={tw`absolute top-5 left-4 z-10`}
      >
        <Icon name="chevron-left" size={55} />
      </TouchableOpacity>

      <Text style={tw`text-2xl text-center font-bold mt-8`}>
        Şifrəni Bərpa Et
      </Text>

      {/* Step 1: Email */}
      {step === 1 && (
        <View style={tw`flex items-center justify-center mt-8 px-4`}>
          <Text style={tw`text-center text-lg text-gray-600 mb-6`}>
            Şifrənizi bərpa etmək üçün email ünvanınızı daxil edin
          </Text>

          <TextInput
            placeholder="Email*"
            placeholderTextColor="black"
            autoCapitalize="none"
            value={email}
            onChangeText={(val) => setEmail(val)}
            style={tw`border-gray-300 w-full h-12 border mb-6 rounded-md text-base px-3`}
          />

          <TouchableOpacity
            onPress={sendForgotCode}
            disabled={!email}
            style={tw`w-full h-12 bg-green-600 rounded-md flex items-center justify-center ${
              !email ? "opacity-50" : "opacity-100"
            }`}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              Şifrəni Bərpa Et
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Kod */}
      {step === 2 && (
        <View style={tw`w-full items-center`}>
          <Text style={tw`text-xl font-semibold mt-14`}>{t("sifreniyaz")}</Text>
          <TextInput
            style={tw`border w-[80%] mt-4 rounded-md text-lg h-12 text-black px-4`}
            placeholder={t("kod")}
            placeholderTextColor={"black"}
            value={code}
            onChangeText={(val) => setCode(val)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={verifyCode}
            style={tw`bg-green-600 w-[80%] py-1 items-center mt-3 rounded-lg text-black`}
          >
            <Text style={tw`text-white font-bold text-xl`}>{t("gonder")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3: Yeni şifre */}
      {step === 3 && (
        <View style={[tw`flex items-center`, {
          paddingTop:insets.top
        }]}>
          <Text style={tw`text-center text-lg font-bold mt-12`}>
            {t("sifrenideyis")}
          </Text>

          <View style={tw`w-full items-center`}>
            <TextInput
              style={tw`border w-[85%] my-2 rounded-md h-12 px-6 text-lg text-black`}
              placeholder={t("yenisifre")}
              onChangeText={(val) => handleChange("newpassword", val)}
              value={form.newpassword}
              secureTextEntry={!newPassShown}
            />
            <TouchableOpacity
              onPress={() => setNewPassShown(!newPassShown)}
              style={tw`absolute right-9 top-2 h-12 w-12 flex items-center justify-center`}
            >
              <Icon
                name={newPassShown ? "eye-off-outline" : "eye-outline"}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <View style={tw`w-full items-center`}>
            <TextInput
              style={tw`border w-[85%] mt-2 rounded-md h-12 px-6 text-lg text-black`}
              placeholder={t("yenisifrenitekrarla")}
              onChangeText={(val) => handleChange("confirmpassword", val)}
              value={form.confirmpassword}
              secureTextEntry={!confirmPassShown}
            />
            <TouchableOpacity
              onPress={() => setConfirmPassShown(!confirmPassShown)}
              style={tw`absolute right-9 top-2 h-12 w-12 flex items-center justify-center`}
            >
              <Icon
                name={confirmPassShown ? "eye-off-outline" : "eye-outline"}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={changePassword}
            style={tw`bg-green-600 mt-6 w-[86%] items-center justify-center rounded-lg py-1`}
          >
            <Text style={tw`text-white text-2xl`}>{t("gonder")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
