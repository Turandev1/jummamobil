import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import axios from "axios";
import { API_URLS } from "../../../config/api";
import { AuthContext, useAuth } from "../../../context/authcontext";

const CustomAlert = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
        <View style={tw`bg-white p-5 rounded-2xl w-80`}>
          <Text style={tw`text-lg font-bold mb-3`}>Dikkat</Text>
          <Text style={tw`text-base mb-5`}>
            Hesabınız silinecek, emin misiniz?
          </Text>

          <View style={tw`flex-row justify-end space-x-3`}>
            <TouchableOpacity onPress={onClose}>
              <Text style={tw`text-gray-500 font-semibold`}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={tw`text-red-600 font-semibold`}>İleri</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Hesabisil = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [passshown, setpassshown] = useState(false);
  const [ireli, setireli] = useState(false);
  const [isallcompleted, setisallcompleted] = useState(false);
  const navigation = useNavigation();
  const { deleteAccount } = useAuth();
  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const handleLogout = async (reason = "Bilinmeyen neden") => {
    console.log(`🚫 [handleLogout] Çıkış işlemi başlatıldı. Neden: ${reason}`);
    // The deleteAccount function will handle logout automatically
  };

  useEffect(() => {
    if (form.email && form.password) {
      setisallcompleted(true);
    } else {
      setisallcompleted(false);
    }
  }, [form]);

  const senddeleterequest = async () => {
    try {
      await deleteAccount(form.email, form.password);
      // The deleteAccount function will handle logout automatically
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.hata ||
        "Xəta baş verdi";
      Alert.alert(t("xeta"), message);
    }
  };

  const handlechange = (key, value) => {
    setform({ ...form, [key]: value });
  };

  const handleireli = () => {
    Alert.alert(t("diqqet"), t("hesabinizsilinicek"), [
      {
        text: t("imtinaet"),
        style: "cancel",
        onPress: () => console.log("Canceled"),
      },
      {
        text: t("ireli"),
        onPress: () => setireli(true),
      },
    ]);
  };

  if (ireli) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-3xl mb-8`}>{t("silmekisteyirsen")}</Text>
        <TouchableOpacity
          onPress={senddeleterequest}
          style={tw`bg-red-700 w-[85%] h-12 flex items-center justify-center mt-3 rounded-md`}
        >
          <Text style={tw`text-2xl font-bold text-white`}>{t("sil1")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setireli(false)}
          style={tw`border border-green-600 w-[85%] h-12 flex items-center justify-center mt-3 rounded-md`}
        >
          <Text style={tw`text-3xl font-bold text-green-700`}>{t("geri")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[tw`flex-1 items-center`, { marginTop: insets.top }]}>
      <Text style={tw`mt-6 text-2xl font-semibold`}>{t("sil")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("profilepage")}
        style={tw`absolute top-4 left-4 w-24 h-20`}
      >
        <Icon name="chevron-left" size={50} color="black" />
      </TouchableOpacity>
      {/* input sahesi */}
      <View style={tw`w-full items-center`}>
        <TextInput
          style={tw`border w-[85%] mt-10 mb-2 rounded-md h-12 px-6 text-lg text-black`}
          placeholderTextColor={"black"}
          placeholder="Email*"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          onChangeText={(val) => handlechange("email", val)}
          value={form.email}
        />
        <View style={tw` w-full items-center`}>
          <TextInput
            style={tw`border w-[85%] mt-2 rounded-md h-12 px-6 text-lg text-black`}
            placeholderTextColor={"black"}
            placeholder={t("movcudsifre")}
            onChangeText={(val) => handlechange("password", val)}
            value={form.password}
            textContentType="password"
            autoComplete="password"
            secureTextEntry={!passshown}
          />
          <TouchableOpacity
            onPress={() => setpassshown(!passshown)}
            style={tw`absolute right-9 top-2 h-12 w-12 flex items-center justify-center`}
          >
            <Icon
              name={passshown ? "eye-off-outline" : "eye-outline"}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={!isallcompleted}
          onPress={handleireli}
          style={tw`w-[80%] rounded-xl bg-red-600 border h-14 flex items-center justify-center mt-10 ${
            isallcompleted ? "opacity-100" : "opacity-50"
          }`}
        >
          <Text style={tw`text-white text-2xl font-bold`}>{t("ireli")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Hesabisil;
