import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../../context/authcontext";

const ListItems = ({ iconname, text, onpress }) => {
  return (
    <View style={tw`px-6 my-1`}>
      <TouchableOpacity
        onPress={onpress}
        style={tw`px-4 bg-white rounded-md h-14 flex-row justify-between items-center border border-gray-300`}
      >
        <View style={tw`flex-row items-center`}>
          <FontAwesome name={iconname} size={25} />
          <Text style={tw`absolute left-9`}>{text}</Text>
        </View>
        <Icon name="chevron-right" size={50} />
      </TouchableOpacity>
    </View>
  );
};

const Profilepage = () => {
  const navigation = useNavigation();
  const { logout, user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [userr, setuserr] = useState(null);
  const [email, setemail] = useState(null);
  const [cikisekrani, setcikisekrani] = useState(false);
  const [isman, setisman] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);

  useEffect(() => {
    const getuser = async () => {
      const admindata = await AsyncStorage.getItem("admin");
      const admin = JSON.parse(admindata);
      if (admin) {
        setName(admin.name);
        setSurname(admin.surname)
        setemail(admin.email);
      } else {
        setuserr(authUser.fullname);
        setemail(authUser.email);
      }
    };
    getuser();
  }, [authUser]);

  const handleLogout = async (reason = "Bilinmeyen neden") => {
    const state = await AsyncStorage.getItem("NAVIGATION_STATE");
    console.log("state:", JSON.parse(state));
    console.log(`🚫 [handleLogout] Çıkış işlemi başlatıldı. Neden: ${reason}`);
    console.log("🚫 [handleLogout] Çıkış işlemi onaylandı.");
    await logout();
    console.log("🚫 [handleLogout] Çıkış işlemi tamamlandı.");
  };

  useEffect(() => {
    if (authUser?.cins === "male") {
      setisman(true);
    } else {
      setisman(false);
    }
  }, []);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const userdata = await AsyncStorage.getItem("admin");
        if (userdata) {
          const user = JSON.parse(userdata);
          const savedRole = user.role;
          console.log("user:", user);
          setRole(savedRole); // "imam" veya "user"
        }
      } catch (e) {
        console.log("Role okunamadı", e);
      }
    };

    loadRole();
  }, []);

  if (cikisekrani) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold mx-16 text-center`}>
          {t("hesabdancixmaqisteyirsen")}
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={tw`w-[85%] bg-red-600 flex items-center justify-center mt-4 h-12 rounded-md`}
        >
          <Text style={tw`text-3xl font-semibold text-white`}>{t("cix")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setcikisekrani(false)}
          style={tw`w-[85%] border-green-600 flex items-center justify-center my-4 border h-12 rounded-md`}
        >
          <Text style={tw`text-3xl font-semibold text-green-700`}>
            {t("geri")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ marginTop: insets.top, flex: 1 }}>
      <Text style={tw`text-center mt-6 mb-4 text-xl font-semibold`}>
        {t("userprofil")}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("bildirisidare")}
        style={tw`absolute right-6 top-4`}
      >
        <MaterialIcons name="notifications" size={40} />
      </TouchableOpacity>
      {/* profile bar */}
      <View
        style={tw`border border-gray-400 bg-white mx-6 rounded-md h-20 pl-4 flex-row items-center justify-between`}
      >
        <View>
          <Text style={tw`text-xl font-semibold`}>
            {role==='imam'?`${name} ${surname}`:userr }

          </Text>
          <Text>{email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("profilredakte")}
          style={tw`h-20 w-20 pb-3 px-3 justify-end items-end`}
        >
          <Feather name="edit" size={30} />
        </TouchableOpacity>
      </View>
      {/* options */}
      <ScrollView style={{ marginBottom: insets.bottom + 70 }}>
        {role === "imam" ? (
          <View style={tw`mt-4 px-6`}>
            <TouchableOpacity
              onPress={() => navigation.navigate("imampanel")}
              style={tw`flex-row h-14 bg-green-600 justify-between items-center rounded-md px-4`}
            >
              <Text style={tw`text-2xl text-white`}>Admin Panel</Text>
              <Icon name="chevron-right" size={50} color={"white"} />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={tw`px-6 mt-4 mb-1`}>
              <TouchableOpacity
                onPress={() => navigation.navigate("market")}
                style={tw`bg-white flex-row justify-between items-center px-4 rounded-md h-14 border border-gray-300`}
              >
                <View style={tw`flex-row items-center`}>
                  <FontAwesome5 size={20} name="box" />
                  <Text style={tw`absolute left-9`}>
                    {t("butunsifarisler")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={50} />
              </TouchableOpacity>
            </View>
            <ListItems
              onpress={() => navigation.navigate("diller")}
              iconname="globe"
              text={t("diller")}
            />
            <View style={tw`px-6 my-1`}>
              <TouchableOpacity
                onPress={() => navigation.navigate("locationpage")}
                style={tw`bg-white flex-row justify-between items-center px-4 rounded-md h-14 border border-gray-300`}
              >
                <View style={tw`flex-row items-center`}>
                  <MaterialIcons size={28} name="location-pin" />
                  <Text style={tw`absolute left-9`}>{t("mekansec")}</Text>
                </View>
                <Icon name="chevron-right" size={50} />
              </TouchableOpacity>
            </View>
            <ListItems iconname="question-circle" text={t("komek")} />
            <ListItems
              onpress={() => navigation.navigate("sifrenideyis")}
              iconname="unlock-alt"
              text={t("sifrenideyis")}
            />
            <ListItems
              onpress={() => navigation.navigate("bizimleelaqe")}
              iconname="envelope"
              text={t("bizimleelaqe")}
            />
            <View style={tw`px-6 my-2`}>
              <TouchableOpacity
                onPress={() => setcikisekrani(true)}
                style={tw`bg-white flex-row justify-between items-center px-4 rounded-md h-14 border border-[#BD2828]`}
              >
                <View style={tw`flex-row items-center`}>
                  <Ionicons size={28} name="exit" color={"#BD2828"} />
                  <Text style={tw`absolute left-9 text-[#BD2828]`}>
                    {t("cixis")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={50} color={"#BD2828"} />
              </TouchableOpacity>
            </View>
            <View style={tw`px-6 mt-2 mb-5`}>
              <TouchableOpacity
                onPress={() => navigation.navigate("hesabisil")}
                style={tw`bg-white flex-row justify-between items-center px-4 rounded-md h-14 border border-[#BD2828]`}
              >
                <View style={tw`flex-row items-center`}>
                  <MaterialIcons size={28} name="delete" color={"#BD2828"} />
                  <Text style={tw`absolute left-9 text-[#BD2828]`}>
                    {t("sil")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={50} color={"#BD2828"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {/* bottombar */}
      <View
        style={[
          tw`absolute bottom-0 w-full pt-3 px-1 border-t bg-[#F2F2F2] border-gray-300 flex-row justify-around items-center`,
          { paddingBottom: insets.bottom },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("mainpage")}
          style={tw`items-center`}
        >
          <Icon name="home-outline" size={34} color={"gray"} />
          <Text>{t("esas")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("mosque")}
          style={tw`items-center ${isman ? "flex" : "hidden"}`}
        >
          <Icon name="mosque" size={30} color={"gray"} />
          <Text>{t("mescidler")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("quran")}
          style={tw`items-center`}
        >
          <FontAwesome6 name="book-open" size={30} color={"gray"} />
          <Text>{t("quran")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("market")}
          style={tw`items-center`}
        >
          <FontAwesome5 name="shopping-cart" size={30} color={"gray"} />
          <Text>{t("market")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`items-center`}>
          <Icon name="account" size={30} color={"black"} />
          <Text>{t("hesab")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profilepage;
