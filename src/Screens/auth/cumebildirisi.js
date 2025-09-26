import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext, useAuth } from "../../context/authcontext";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import tw from "twrnc";

const Cumebildirisi = () => {
  const { setIsAuth } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();

      if (newStatus !== "granted") {
        return false;
      }
    }

    return true;
  };

  const handleaktivet = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      Alert.alert(t("gozel"), t("herseyhazirdir"));
      navigation.navigate("login");
    } else {
      Alert.alert(
        "İcazə rədd edildi",
        "Bildiriş icazəsi verilmədi. Bildirişləri aktiv etmək üçün parametrlərdən icazə verin."
      );
    }
    // Burada bildirişləri aktiv etmək üçün kod əlavə edin
  };

  const handlebagla = () => {
    navigation.navigate("login");
  };

  return (
    <View style={{ marginTop: insets.top + 10 }}>
      <View style={tw`flex items-center justify-center mt-16`}>
        <Image
          resizeMode="cover"
          style={tw`w-60 h-52`}
          source={require("../../../assets/mescid.png")}
        />
      </View>
      <View style={tw`flex items-center justify-center mt-8 px-12`}>
        <Text style={tw`text-center text-xl font-normal`}>
          {t("bildirisiac")}
        </Text>
      </View>
      <View style={tw`flex items-center justify-center mt-6`}>
        <TouchableOpacity
          onPress={handleaktivet}
          style={tw`bg-green-600 rounded-md w-[90%] h-12 flex items-center justify-center mt-10 mx-auto`}
        >
          <Text style={tw`text-white text-xl font-semibold`}>
            {t("aktivet")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlebagla}
          style={tw`bg-white rounded-md border border-green-600 w-[90%] h-12 flex items-center justify-center mt-4 mx-auto`}
        >
          <Text style={tw`text-green-600 text-xl font-semibold`}>
            {t("bagla")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cumebildirisi;
