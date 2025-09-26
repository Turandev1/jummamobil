import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import tw from "twrnc";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../config/api";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/authcontext";

const Mosque = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [mescids, setmescids] = useState([]);
  const [showmap, setshowmap] = useState(false);
  const slideanim = useRef(new Animated.Value(0)).current;
  const rotateanim = useRef(new Animated.Value(0)).current;
  const [selectedmescidid, setselectedmescidid] = useState(null);
  const [cumemescidi, setcumemescidi] = useState([]);
  const [showmescid, setshowmescid] = useState(false);
  const { setcumemescid } = useAuth();

  useEffect(() => {
    const getmescids = async () => {
      try {
        const res = await axios.get(API_URLS.ADMINS.GETMESCIDS);
        setmescids(res.data?.mescids);
        console.log('res;',res.data?.mescids)

        const mesciddata = await AsyncStorage.getItem("cumemescidi");
        console.log("cumemescidi", mesciddata);
        if (mesciddata) {
          const parsed = JSON.parse(mesciddata);
          setcumemescidi(parsed);
        }
      } catch (error) {
        console.error(error);
        console.log('xeta')
      }
    };
    getmescids();
  }, []);

  const togglemap = () => {
    const toValue = showmap ? 0 : 1;
    setshowmap(!showmap);

    Animated.timing(rotateanim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(slideanim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotateinterpolate = rotateanim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const slideinterpolate = slideanim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const setmescid = async () => {
    try {
      const res = await setcumemescid({ cumemescidi });
      Alert.alert(t("ugurlu"), t("mescidsecildi"));
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
        tw`flex-1 items-center`,
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

      {/* Map Toggle */}
      <View style={tw`w-full items-center mt-2`}>
        <TouchableOpacity
          onPress={togglemap}
          style={tw`border-t items-center flex-row justify-between w-[88%]`}
        >
          <Text style={tw`text-lg`}>{t("xerite")}</Text>
          <Animated.View style={{ transform: [{ rotate: rotateinterpolate }] }}>
            <Icon name="chevron-down" size={40} style={tw``} />
          </Animated.View>
        </TouchableOpacity>
        <Animated.View
          style={[
            tw`w-full bg-gray-200 rounded-md mt-2`,
            { height: slideinterpolate },
          ]}
        >
          <MapView
            style={{ flex: 1, width: "100%" }}
            mapType="hybrid"
            showsUserLocation={true}
            showsCompass={true}
            zoomEnabled={true}
            scrollEnabled={true}
            initialRegion={{
              latitude: 40.4093,
              longitude: 49.8671,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {selectedMescidData && (
              <Marker
                coordinate={{
                  latitude: selectedMescidData.mescid.latitude,
                  longitude: selectedMescidData.mescid.longitude,
                }}
                title={selectedMescidData.mescid.name}
                titleVisibility="adaptive"
              />
            )}
          </MapView>
        </Animated.View>
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
                  JSON.stringify([mescid.mescid])
                );
                setselectedmescidid(mescid.mescid.id);
                setcumemescidi([mescid.mescid]);
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

      {/* Seçilen Mescid Button */}
      <View style={tw`absolute bottom-28 right-4`}>
        <TouchableOpacity
          onPress={() => setshowmescid(true)}
          style={tw`w-40 py-1 items-center rounded-md border ${
            cumemescidi.length === 1 ? "border-red-500" : ""
          }`}
        >
          <Text style={tw`${cumemescidi.length === 1 ? "text-red-500" : ""}`}>
            {t("secilenmescid")}
          </Text>
          <Text style={tw`${cumemescidi.length === 1 ? "text-red-500" : ""}`}>
            {Array.isArray(cumemescidi) ? cumemescidi.length : 0}/1
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal - seçilen mescid bilgisi */}
      <Modal visible={showmescid} transparent animationType="fade">
        <View style={tw`flex-1 bg-black/50 justify-center items-center`}>
          <View style={tw`bg-white w-[85%] rounded-xl p-5`}>
            {/* Kapatma ikonu */}
            <TouchableOpacity
              onPress={() => setshowmescid(false)}
              style={tw`absolute top-2 right-2`}
            >
              <Icon name="close" size={28} color="black" />
            </TouchableOpacity>

            <Text style={tw`text-xl font-bold text-center mb-4`}>
              {t("secilenmescid")}
            </Text>

            {selectedMescidData ? (
              <View>
                <Text style={tw`text-lg mb-2`}>
                  📍 {selectedMescidData.mescid.name} {t("mescidi")}
                </Text>
                <Text style={tw`text-base text-gray-600 ml-7`}>
                  {selectedMescidData.mescid.location}
                </Text>
              </View>
            ) : (
              <Text style={tw`text-center text-gray-500`}>
                {t("mescidsecilmedi")}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Mosque;
