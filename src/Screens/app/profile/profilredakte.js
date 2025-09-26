import{
  Alert,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { API_URLS } from "../../../config/api";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/authcontext";

const Profilredakte = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [editmode, seteditmode] = useState(false);
  const navigation = useNavigation();
  const { user, updateUserInfo } = useAuth();
  const [showoptions, setshowoptions] = useState(false)
  const [form, setform] = useState({
    fullname: "",
    email: "",
    phone: "",
    cins: "",
  });

  const slideanim=useRef(new Animated.Value(0)).current


  const handlechange = (key, value) => {
    setform({ ...form, [key]: value });
  };

  useEffect(() => {
    if (user) {
      setform({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        cins: user.cins || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const res = await updateUserInfo(form);
      if (res.success) {
        Alert.alert("Uğurlu", "Profil məlumatlarınız yeniləndi");
        seteditmode(false);
      } else {
        Alert.alert("Xəta", res.message || "Məlumat yenilənmədi");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Xəta", "Serverdə problem oldu");
    }
  };


  const toggleoptions = () => {
    if (showoptions) {
      Animated.timing(slideanim, {
        toValue: 0,
        duration: 300,
        useNativeDriver:false,
      }).start(()=>setshowoptions(false))
    } else {
      setshowoptions(true)
      Animated.timing(slideanim, {
        toValue: 250,
        useNativeDriver: false,
        duration:300,
      }).start()
    }
  }

  return (
    <View style={{ marginTop: insets.top, flex: 1, alignItems: "center" }}>
      <Text style={tw`mt-8 font-bold text-2xl`}>{t("profiliredaktəet")}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("profilepage")}
        style={tw`absolute top-6 left-4 w-24 h-16`}
      >
        <Icon name="chevron-left" size={50} />
      </TouchableOpacity>
      <View style={tw`w-full mt-4`}>
        <TextInput
          style={tw`mt-3 mx-5 px-5 rounded-md text-base ${
            editmode ? "border-2 border-green-700" : "border border-gray-400"
          }`}
          placeholder="Ad,Soyad"
          onChangeText={(val) => handlechange("fullname", val)}
          editable={editmode}
          value={form.fullname}
        />
        <TextInput
          style={tw`mt-3 mx-5 px-5 rounded-md text-base ${
            editmode ? "border-2 border-green-700" : "border border-gray-400"
          }`}
          placeholder="Email"
          onChangeText={(val) => handlechange("email", val)}
          value={form.email}
          editable={editmode}
        />
        <TextInput
          style={tw`mt-3 mx-5 px-5 rounded-md text-base ${
            editmode ? "border-2 border-green-700" : "border border-gray-400"
          }`}
          placeholder="Mobil nömrə"
          onChangeText={(val) => handlechange("phone", val)}
          editable={editmode}
          value={form.phone}
        />
        {!editmode ? (
          <View
            style={tw`mx-5 border mt-3 h-14 justify-center px-5 rounded-md`}
          >
            <Text style={tw`text-base text-black`}>
              {user.cins === "male" ? t("kisi") : t("qadin")}
            </Text>
          </View>
        ) : (
          <View style={tw`mx-5 mt-3 rounded-md border-2 px-3 border-green-700`}>
            <Picker
                mode="dropdown"
                dropdownIconColor={'black'}
              style={{
                borderWidth: 1,
                paddingLeft: 7,
                color: "black",
              }}
              selectedValue={form.cins}
              onValueChange={(value) => handlechange("cins", value)}
            >
              <Picker.Item label="Seçin" value="" />
              <Picker.Item label="KİŞİ" value="male" />
              <Picker.Item label="QADIN" value="female" />
            </Picker>
          </View>
        )}

        {editmode ? (
          <View style={tw`px-5 flex-row mt-3 justify-between`}>
            <TouchableOpacity
              onPress={() => seteditmode(false)}
              style={tw`h-14 w-[47%] bg-red-500 border-red-500 border flex items-center justify-center rounded-md`}
            >
              <Text style={tw`text-2xl text-white`}>{t("imtinaet")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdate}
              style={tw`h-14 w-[47%] border flex items-center bg-green-600 border-green-600 justify-center rounded-md`}
            >
              <Text style={tw`text-2xl text-white`}>{t("qeydet")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => seteditmode(true)}
            style={tw`mx-5 flex items-center justify-center border border-green-600 mt-3 h-14 rounded-md`}
          >
            <Text style={tw`text-2xl font-semibold text-green-700`}>
              {t("deyis")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`w-full`}>
        <TouchableOpacity
          onPress={toggleoptions}
          style={tw`mx-5 flex items-center justify-center border border-green-600 mt-8 h-14 rounded-md`}
        >
          <Text style={tw`text-2xl font-semibold text-green-700`}>
            {!showoptions?
              t("hesabideyis") :
              t('bagla')
            }
          </Text>
        </TouchableOpacity>
        {showoptions && (
          <Animated.View
            style={[
              tw`mx-5 mt-3 justify-center rounded-lg overflow-hidden border`,
              { height: slideanim }, // animasyon yükseklik
            ]}
          >
            {/* <TouchableOpacity
              style={tw`mx-5 flex items-center justify-center border border-green-600 h-14 rounded-md`}
              onPress={() => navigation.navigate('imampanel',{acctype:'admin'})}
            >
              <Text style={tw`text-2xl font-semibold text-green-700`}>
                {t("admin")}
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={tw`mx-5 flex items-center justify-center border border-green-600 mt-2 h-14 rounded-md`}
              onPress={() => navigation.navigate('loginpage',{acctype:'imam'})}
            >
              <Text style={tw`text-2xl font-semibold text-green-700`}>
                {t("imam")}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={tw`mx-5 flex items-center justify-center border border-green-600 mt-2 h-14 rounded-md`}
              onPress={() => navigation.navigate('imampanel',{acctype:'satici'})}
            >
              <Text style={tw`text-2xl font-semibold text-green-700`}>
                {t("satici")}
              </Text>
            </TouchableOpacity> */}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default Profilredakte;
