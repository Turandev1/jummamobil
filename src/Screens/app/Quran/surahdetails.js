import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URLS } from "../../../config/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTransitionProgress } from "react-native-screens";
import { useTranslation } from "react-i18next";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const Surahdetails = () => {
  const route = useRoute();
  const { surahnumber } = route.params;
  const [ayahs, setayahs] = useState([]);
  const [sayfa, setsayfa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentpageindex, setcurrentpageindex] = useState(0);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation=useNavigation()

  const ayahnames = {
    1: t("fatiha"),
    2: t("baqara"),
    3: t("aliimran"),
    4: t("nisa"),
    5: t("maida"),
    6: t("anam"),
    7: t("araf"),
    8: t("anfal"),
    9: t("tavba"),
    10: t("yunus"),
    11: t("hud"),
    12: t("yusuf"),
    13: t("rad"),
    14: t("ibrahim"),
    15: t("hicr"),
    16: t("nahl"),
    17: t("isra"),
    18: t("kahf"),
    19: t("maryam"),
    20: t("taha"),
    21: t("anbiya"),
    22: t("hac"),
    23: t("muminun"),
    24: t("nur"),
    25: t("furqan"),
    26: t("shuara"),
    27: t("naml"),
    28: t("qasas"),
    29: t("ankabut"),
    30: t("rum"),
    31: t("luqman"),
    32: t("sacda"),
    33: t("ahzab"),
    34: t("saba"),
    35: t("fatir"),
    36: t("ya-sin"),
    37: t("saffat"),
    38: t("sad"),
    39: t("zumar"),
    40: t("ghafir"),
    41: t("fussilat"),
    42: t("shura"),
    43: t("zuxruf"),
    44: t("dukhan"),
    45: t("casiya"),
    46: t("ahqaf"),
    47: t("muhammad"),
    48: t("fetih"),
    49: t("hujurat"),
    50: t("qaf"),
    51: t("zariyat"),
    52: t("tur"),
    53: t("najm"),
    54: t("qamar"),
    55: t("rahman"),
    56: t("waqia"),
    57: t("hadid"),
    58: t("mujadila"),
    59: t("hashr"),
    60: t("mumtahina"),
    61: t("saff"),
    62: t("cuma"),
    63: t("munafiqun"),
    64: t("taghabun"),
    65: t("talaq"),
    66: t("tahrim"),
    67: t("mulk"),
    68: t("qalam"),
    69: t("haqqa"),
    70: t("maarij"),
    71: t("nuh"),
    72: t("jinn"),
    73: t("muzzammil"),
    74: t("muddasir"),
    75: t("qiyama"),
    76: t("insan"),
    77: t("mursalat"),
    78: t("naba"),
    79: t("naziyat"),
    80: t("abasa"),
    81: t("takwir"),
    82: t("infitar"),
    83: t("mutaffifin"),
    84: t("inshiqaq"),
    85: t("buruj"),
    86: t("tariq"),
    87: t("ala"),
    88: t("ghashiya"),
    89: t("fajr"),
    90: t("balad"),
    91: t("shams"),
    92: t("layl"),
    93: t("duha"),
    94: t("inshirah"),
    95: t("tin"),
    96: t("alaq"),
    97: t("qadr"),
    98: t("bayyina"),
    99: t("zalzala"),
    100: t("adiyat"),
    101: t("qaria"),
    102: t("takasur"),
    103: t("asr"),
    104: t("humaza"),
    105: t("fil"),
    106: t("quraysh"),
    107: t("maun"),
    108: t("kavsar"),
    109: t("kafirun"),
    110: t("nasr"),
    111: t("tebbet"),
    112: t("ikhlas"),
    113: t("falaq"),
    114: t("nas"),
  };

  useEffect(() => {
    const getSurah = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URLS.APP.GETMUSHAFAZ}/${surahnumber}`
        );

        const verses = res.data.verses;
        setayahs(verses);

        const grouped = verses.reduce((acc, ayah) => {
          if (!acc[ayah.page]) acc[ayah.page] = [];
          acc[ayah.page].push(ayah);
          return acc;
        }, {});

        const sortedPages = Object.keys(grouped)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => grouped[key]);

        setsayfa(sortedPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getSurah();
  }, [surahnumber]);

  const getSurahTranslation = (number) => ayahnames[number];

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom,flex:1,backgroundColor:'white' }}
    >
      {loading ? (
        <ActivityIndicator size="large" style={tw`mt-10`} />
      ) : (
        <FlatList
          data={sayfa}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          windowSize={10}
          initialNumToRender={2}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setcurrentpageindex(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width,paddingVertical:6 }}>
              <View style={tw`relative flex justify-center border-b pb-2 px-4 mt-3 mb-4`}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("quran")}
                  style={tw`absolute top-2 left-2`}
                >
                  <Icon name="arrow-left" size={30} />
                </TouchableOpacity>
                <Text style={tw`text-lg ml-10 font-bold`}>
                  {surahnumber}.{getSurahTranslation(surahnumber)} {t("suresi")}
                </Text>
                <Text style={tw`ml-10`}>
                  {t("sehife")} ({item[0]?.page}/604) - {item[0]?.juz}.{" "}
                  {t("cuz")}
                </Text>
              </View>

              {/* İç ScrollView yerine nested FlatList */}
              <FlatList
                data={item}
                style={tw`border-r border-b mr-2`}
                keyExtractor={(a) => a.numberInSurah.toString()}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: a }) => (
                  <View style={tw`flex-row px-4`}>
                    <Text style={tw`mb-3"`}>
                      <Text style={tw`text-xl font-bold`}>
                        {a.numberInSurah}.
                      </Text>
                      <Text style={tw`text-lg`}>{a.text}</Text>
                    </Text>
                  </View>
                )}
              />
              {/* <View></View> */}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Surahdetails;
