import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import tw from "twrnc";
import { useAuth } from "../../../../context/authcontext";

const Imamlogin = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [isShown, setisShown] = useState(false);
  const navigation = useNavigation();
  const [isallcompleted, setisallcompleted] = useState(false);
  const { loginimamaccount } = useAuth();

  const [form, setform] = useState({
    email: "",
    password: "",
  });

  const handlechange = (key, value) => {
    setform({ ...form, [key]: value });
  };

  const handlelogin = async () => {
    try {
      const result = await loginimamaccount(form.email, form.password);

      Alert.alert(t('ugurlu'), `Giriş ugurludur.Xos geldin ${result.user.name}`)
      navigation.navigate('profilepage')
    } catch (error) {
      console.error(error);
      const err = error.response?.data?.hata;
      Alert.alert("Xeta", err);
    }
  };


  return (
    <View style={tw`flex items-center px-8 justify-center`}>
      <Text style={tw`text-xl mt-12`}>{t("imamkimidaxilolun")}</Text>
      <TextInput
        value={form.email}
        autoCapitalize="none"
        placeholderTextColor={'black'}
        textContentType="emailAddress"
        autoComplete="email"
        onChangeText={(val) => handlechange("email", val)}
        style={tw`border w-full text-black mt-8 px-4 rounded-md text-lg`}
        placeholder="Email*"
      />

      <View style={tw`w-full mt-5 relative`}>
        <TextInput
          value={form.password}
          placeholderTextColor={'black'}
          secureTextEntry={!isShown}
          textContentType="password"
          autoComplete="password"
          autoCapitalize="none"
          onChangeText={(val) => handlechange("password", val)}
          style={tw`w-full border text-black rounded-md pl-4 pr-12 text-lg`}
          placeholder={t("sifre")}
        />
        <TouchableOpacity
          onPress={() => setisShown(!isShown)}
          style={tw`absolute right-1 -top-1 h-14 w-12 flex items-center justify-center`}
        >
          <Icon name={isShown ? "eye-off-outline" : "eye-outline"} size={27} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handlelogin}
        style={tw`w-full border border-green-600 flex items-center justify-center mt-6 h-12 rounded-md`}
      >
        <Text style={tw`text-2xl text-green-600`}>{t("gonder")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Loginpage = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { acctype } = route.params;
  return (
    <View style={{ marginTop: insets.top }}>
      {acctype === "imam" && <Imamlogin />}
    </View>
  );
};

export default Loginpage;
