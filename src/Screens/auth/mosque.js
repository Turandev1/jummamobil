import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URLS } from "../../config/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../context/authcontext";

const Mescidsec = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [mescids, setmescids] = useState([]);
  const [showmap, setshowmap] = useState(false);
  const [selectedmescidid, setselectedmescidid] = useState(null);
  const [cumemescidi, setcumemescidi] = useState([]);
  const [showmescid, setshowmescid] = useState(false);
  const { setuserinfo } = useAuth();

  useEffect(() => {
    const getmescids = async () => {
      const res = await axios.get(API_URLS.ADMINS.GETMESCIDS);
      setmescids(res.data?.mescids);

      const mesciddata = await AsyncStorage.getItem("mescid");
      if (mesciddata) {
        const parsed = JSON.parse(mesciddata);
        setcumemescidi(parsed);

        // ✅ Kaydedilmiş mescid varsa state’e yükle
        if (parsed.length > 0) {
          setselectedmescidid(parsed[0].id);
        }
      }
    };
    getmescids();
  }, []);

  const setmescid = async () => {
    try {
      const res = await setuserinfo();
      
      navigation.navigate('cumebildirisi')
    } catch (error) {
      console.error(error);
    }
  };

  // Seçilen mescidi bulmak için helper
  const selectedMescidData =
    cumemescidi.length > 0
      ? mescids.find((m) => m?.mescid.id === cumemescidi[0].id)
      : null;

  return (
    <View
      style={[
        tw`flex-1 bg-green-50 items-center`,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("mainpage")}
        style={tw`absolute top-12 left-4 z-10`}
      >
        <Icon name="chevron-left" size={60} />
      </TouchableOpacity>
      <Text style={tw`text-2xl mt-6`}>Məscid seç</Text>

      <View style={tw`w-full mt-5 items-center justify-center`}>
        <View style={tw`w-[88%]`}>
          <TextInput
            style={tw`w-full border text-black pl-9 rounded-md`}
            placeholder={t("search")}
          />
          <View style={tw`absolute top-2 left-1`}>
            <MaterialIcons name="search" size={30} />
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={mescids}
        style={tw`w-full border-t-2 border-green-600 mt-3`}
        keyExtractor={(item) => item._id}
        renderItem={({ item: mescid }) => (
          <View style={tw`w-full px-5 mt-1`}>
            <TouchableOpacity
              style={tw`border-b mt-2 pb-2 flex-row items-center justify-between`}
              onPress={async () => {
                await AsyncStorage.setItem(
                  "cumemescidi",
                  JSON.stringify(mescid.mescid)
                );

                setselectedmescidid(mescid.mescid.id);
              }}
            >
              <View>
                <Text style={tw`ml-2 text-xl`}>
                  {mescid.mescid.name} {t("mescidi")}
                </Text>
                <View style={tw`flex-row items-center`}>
                  <MaterialIcons
                    size={28}
                    name="location-pin"
                    color={"green"}
                  />
                  <Text>{mescid.mescid.location}</Text>
                </View>
              </View>
              <View>
                <MaterialIcons
                  size={30}
                  name={
                    selectedmescidid === mescid.mescid.id
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  color={
                    selectedmescidid === mescid.mescid.id ? "green" : "black"
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Save Button */}
      <View
        style={[
          tw`w-full items-center absolute bottom-0 bg-green-50`,
          {
            paddingBottom: insets.bottom + 4,
          },
        ]}
      >
        <TouchableOpacity
          onPress={setmescid}
          disabled={!selectedmescidid}
          style={tw`bg-green-600 w-[70%] h-10 rounded-md flex items-center justify-center ${
            selectedmescidid ? "" : "opacity-50"
          }`}
        >
          <Text style={tw`text-2xl text-white`}>{t("sec")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Mescidsec;
