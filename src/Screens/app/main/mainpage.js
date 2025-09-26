import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import axios from "axios";
import { useAppcontext } from "../../../context/appcontext";
import { AuthContext, useAuth } from "../../../context/authcontext";
import { API_URLS } from "../../../config/api";
import { citynames } from "./data";
import tw from "twrnc";
import { useQuery } from "@tanstack/react-query";

const fetchPrayTimes = async (city, country, method) => {
  const res = await axios.get(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method ?? 13}`
  );
  return res.data.data.timings;
};

const Mainpage = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [subh, setsubh] = useState(null);
  const [guncixma, setguncixma] = useState(null);
  const [gunorta, setgunorta] = useState(null);
  const [ikindi, setikindi] = useState(null);
  const [axsam, setaxsam] = useState(null);
  const [yatsi, setyatsi] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [nextpraytime, setnextpraytime] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const { olke, sheher, metod } = useAppcontext();
  const { user } = useAuth();
  const [isman, setisman] = useState(false);
  const [isupdate, setisupdate] = useState(false);
  const [url, seturl] = useState("");

  const { data: timings } = useQuery({
    queryKey: ["prayTime", olke, sheher, metod],
    queryFn: () => fetchPrayTimes(sheher, olke, metod),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
    enabled: !!olke && !!sheher,
  });

  const getversion = async () => {
    try {
      const res = await axios.get(API_URLS.APP.GETVERSION);
      const data = res.data;

      if (!data || !data.latestVersion || !data.updateUrl) {
        console.log("Version API response missing required data:", data);
        return;
      }

      const localversion = Constants.expoConfig?.version || "1.0.0";
      const latesversion = data.latestVersion;
      const updateurl = data.updateUrl;
      seturl(updateurl);
      if (compareversions(localversion, latesversion) < 0) {
        setisupdate(true);
      } else {
        setisupdate(false);
      }

      function compareversions(v1, v2) {
        if (!v1 || !v2) return 0;

        const v1parts = v1.split(".").map(Number);
        const v2parts = v2.split(".").map(Number);

        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
          if ((v1parts[i] || 0) > (v2parts[i] || 0)) return 1;
          if ((v1parts[i] || 0) < (v2parts[i] || 0)) return -1;
        }
        return 0;
      }
    } catch (error) {
      console.error("Versiya yoxlanarkən xəta:", error);
      console.log(error?.message);
    }
  };

  const openurl = () => {
    Linking.openURL("https://kovrolin.az/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.cins === "male") {
      setisman(true);
    } else if (user?.cins === "female") {
      setisman(false);
    }
  }, []);

  useEffect(() => {
    getversion();
  }, []);

  // timings verisini state'e set etmek ve countdown hesaplamak
  useEffect(() => {
    if (!timings) return;

    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const prayers = [
      { name: t("subh"), time: formatTime(timings.Fajr) },
      { name: t("gunchixma"), time: formatTime(timings.Sunrise) },
      { name: t("gunorta"), time: formatTime(timings.Dhuhr) },
      { name: t("ikindi"), time: formatTime(timings.Asr) },
      { name: t("axsam"), time: formatTime(timings.Maghrib) },
      { name: t("yatsi"), time: formatTime(timings.Isha) },
    ];

    // Current Prayer
    const now = new Date();
    const current = prayers.find(
      (p, i) =>
        now >= p.time &&
        now < (prayers[i + 1]?.time || new Date(now.getTime() + 86400000))
    );
    setCurrentPrayer(current ? current.name : null);

    // Next Prayer
    let next = prayers.find((p) => p.time > now);
    if (!next) {
      // Ertesi günün sabah namazı
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const [h, m] = timings.Fajr.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      next = { name: t("subh"), time: d };
    }
    setNextPrayer(next.name);
    setnextpraytime(
      next.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    setTimeRemaining(Math.floor((next.time - now) / 1000));

    // Tek seferde tüm vakitleri state’e set et
    setsubh(timings.Fajr);
    setguncixma(timings.Sunrise);
    setgunorta(timings.Dhuhr);
    setikindi(timings.Asr);
    setaxsam(timings.Maghrib);
    setyatsi(timings.Isha);
  }, [timings]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  return (
    <View style={[tw`flex-1 items-center`, { marginTop: insets.top }]}>
      <Text style={tw`font-bold text-2xl mt-6 mb-3`}>Jumma</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("notifications")}
        // style={tw`absolute top-4 right-8 z-10`}
        style={{
          position: "absolute",
          top: 18,
          right: 28,
        }}
      >
        <MaterialIcons name="notifications-active" size={40} />
      </TouchableOpacity>

      <ScrollView
        style={tw`w-full`}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 90,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`w-full relative mt-2 items-center px-5 rounded-md`}>
          <Image
            style={tw`w-full h-36 rounded-md`}
            source={require("../../../../assets/ianesekli.png")}
            resizeMode="cover"
          />
          <View style={tw`absolute w-[94%]`}>
            <Text style={tw`text-xl font-semibold text-white`}>
              {t("mescidleredestek")}
            </Text>
            <Text style={tw`w-[63%] font-bold`}>{t("mesciddestekmetin")}</Text>
            <Text style={tw`font-bold`}>{t("tesekkuredirik")}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("iane")}
              style={tw`bg-green-600 rounded-md w-[50%] h-7 items-center justify-center`}
            >
              <Text style={tw`text-lg text-white font-bold`}>
                {t("ianeet")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={openurl}
          style={tw`w-[92%] h-[86px] mt-2 px-1 bg-white flex-row items-center justify-center mb-2 rounded-lg`}
        >
          <Image
            resizeMode="contain"
            style={tw`rounded-lg w-full h-full`}
            source={require("../../../../assets/logo.jpg")}
          />
        </TouchableOpacity>
        <View style={tw`mt-2 w-full flex-row justify-center items-center`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ayliqvaxtlar")}
            style={tw`border h-12 w-[43%] rounded-md flex items-center justify-center`}
          >
            <Text style={tw`text-2xl font-semibold`}>{t("ayliq")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!sheher) {
                navigation.navigate("locationpage");
              } else {
                return null;
              }
            }}
            style={tw`border h-12 w-[43%] rounded-md ml-6 flex items-center justify-center bg-green-100 border-green-600`}
          >
            <Text style={tw`font-semibold ${sheher ? "text-2xl" : "text-lg"}`}>
              {sheher ? citynames[olke][0][sheher] : t("mekansec")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row h-[18%] my-1`}>
          <View
            style={tw`items-start w-[53%] h-auto justify-between pt-1 pb-2`}
          >
            <Text style={tw`text-lg font-bold`}>{t("novbetinamaz")}</Text>
            <Text style={tw`text-3xl font-bold`}>{nextpraytime}</Text>
            <Text style={tw`text-base text-green-600`}>
              {formatTime(timeRemaining)} {t("sonda")} {nextPrayer}
            </Text>
          </View>
          <View
            style={tw`w-[34%] h-auto flex items-center justify-center pt-1`}
          >
            <Image
              style={tw`w-[90%] h-[90%]`}
              resizeMode="cover"
              source={require("../../../../assets/mescid.png")}
            />
          </View>
        </View>
        {/* namaz vaxtlari */}
        <View style={tw`w-full px-5 mb-5`}>
          <View style={tw`flex-row justify-between pb-1 border-b w-full`}>
            <Text
              style={tw`text-lg font-semibold ${
                currentPrayer === t("subh") ? "text-green-600" : ""
              }`}
            >
              {t("subh")}
            </Text>
            <Text
              style={tw`text-lg ${
                currentPrayer === t("subh") ? "text-green-600" : ""
              }`}
            >
              {subh}
            </Text>
          </View>
          <View style={tw`flex-row justify-between mt-1 pb-1 border-b w-full`}>
            <Text
              style={tw`text-lg font-semibold ${
                currentPrayer === t("gunchixma") ? "text-green-600" : ""
              }`}
            >
              {t("gunchixma")}
            </Text>
            <Text
              style={tw`text-lg ${
                currentPrayer === t("gunchixma") ? "text-green-600" : ""
              }`}
            >
              {guncixma}
            </Text>
          </View>
          <View style={tw`flex-row justify-between mt-1 pb-1 border-b w-full`}>
            <Text
              style={tw`text-lg font-semibold ${
                currentPrayer === t("gunorta") ? "text-green-600" : ""
              }`}
            >
              {t("gunorta")}
            </Text>
            <Text
              style={tw`text-lg ${
                currentPrayer === t("gunorta") ? "text-green-600" : ""
              }`}
            >
              {gunorta}
            </Text>
          </View>
          <View style={tw`flex-row justify-between mt-1 pb-1 border-b w-full`}>
            <Text
              style={tw`text-lg font-semibold ${
                currentPrayer === t("ikindi") ? "text-green-600" : ""
              }`}
            >
              {t("ikindi")}
            </Text>
            <Text
              style={tw`text-lg ${
                currentPrayer === t("ikindi") ? "text-green-600" : ""
              }`}
            >
              {ikindi}
            </Text>
          </View>
          <View style={tw`flex-row justify-between mt-1 pb-1 border-b w-full`}>
            <Text
              style={tw`text-lg font-semibold ${
                currentPrayer === t("axsam") ? "text-green-700" : ""
              }`}
            >
              {t("axsam")}
            </Text>
            <Text
              style={tw`text-lg ${
                currentPrayer === t("axsam") ? "text-green-600" : ""
              }`}
            >
              {axsam}
            </Text>
          </View>
          <View style={tw`flex-row justify-between mt-1 pb-1 border-b w-full`}>
            <Text
              style={tw`text-lg font-semibold ${
                currentPrayer === t("yatsi") ? "text-green-600" : ""
              }`}
            >
              {t("yatsi")}
            </Text>
            <Text
              style={tw`text-lg ${
                currentPrayer === t("yatsi") ? "text-green-600" : ""
              }`}
            >
              {yatsi}
            </Text>
          </View>
        </View>
      </ScrollView>

      {isupdate && (
        <View
          style={tw`bg-indigo-100 flex-row justify-between items-center px-2 absolute bottom-[124px] w-full h-14`}
        >
          <Text>Tətbiqin yeni versiyası mövcuddur</Text>
          <TouchableOpacity
            style={tw`bg-green-600 px-2 rounded-lg py-1`}
            onPress={() => Linking.openURL(url)}
          >
            <Text style={tw`text-white font-bold`}>Yenilə</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* bottombar */}
      <View
        style={[
          tw`absolute -bottom-9 w-full h-28 px-1 bg-[#F2F2F2] border-t border-gray-300 flex-row justify-around items-start pt-3`,
          { marginBottom: insets.bottom },
        ]}
      >
        <TouchableOpacity style={tw`items-center`}>
          <Icon name="home-outline" size={34} />
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
        <TouchableOpacity
          onPress={() => navigation.navigate("profilepage")}
          style={tw`items-center`}
        >
          <Icon name="account" size={30} color={"gray"} />
          <Text>{t("hesab")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Mainpage;
