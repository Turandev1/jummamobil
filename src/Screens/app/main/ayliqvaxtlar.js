import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
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
import tw from "twrnc";
import axios from "axios";
import { useAppcontext } from "../../../context/appcontext";
import { useQuery } from "@tanstack/react-query";
import { fetchmonthlypraytimes } from "../../../config/api";

const Ayliqvaxtlar = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { olke, sheher, metod } = useAppcontext();

  const weekdays = {
    Sunday: t("bazar"),
    Monday: t("bazarertesi"),
    Tuesday: t("chersenbeaxshami"),
    Wednesday: t("chersenbe"),
    Thursday: t("cumeaxsami"),
    Friday: t("cume"),
    Saturday: t("senbe"),
  };

  const months = {
    January: t("yanvar"),
    February: t("fevral"),
    March: t("mart"),
    April: t("aprel"),
    May: t("may"),
    June: t("iyun"),
    July: t("iyul"),
    August: t("avqust"),
    September: t("sentyabr"),
    October: t("oktyabr"),
    November: t("noyabr"),
    December: t("dekabr"),
  };

  const hijriMonths = {
    1: t("muharrem"),
    2: t("sefer"),
    3: t("rebiulevvel"),
    4: t("rebiulaxir"),
    5: t("cemaziyelevvel"),
    6: t("cemaziyelaxir"),
    7: t("receb"),
    8: t("saban"),
    9: t("ramazan"),
    10: t("sevval"),
    11: t("zilqede"),
    12: t("zilhicce"),
  };

  const getWeekday = (day) => weekdays[day] || day;
  const getMonth = (month) => months[month] || month;
  const gethijrimonths = (month) => hijriMonths[month];

  const {
    data: next30days = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["prayerTimes", olke, sheher, metod],
    queryFn: () => fetchmonthlypraytimes(olke, sheher, metod),
    staleTime: 1000 * 60 * 60 * 12,
    cacheTime: 1000 * 60 * 60 * 24 * 30,
    enabled: !!(olke && sheher),
  });

  const renderItem = ({ item }) => (
    <View style={tw`items-center w-full`}>
      <View
        style={tw`flex-row border-b border-gray-300 w-[95%] mb-1 mt-4 justify-between`}
      >
        <View style={tw`flex-row gap-x-1`}>
          <Text style={tw`text-base font-bold`}>{item.date.gregorian.day}</Text>
          <Text style={tw`text-base font-bold`}>
            {getMonth(item.date.gregorian.month.en).substring(0, 3)}
          </Text>
          <Text style={tw`text-base font-bold`}>
            {getWeekday(item.date.gregorian.weekday.en)}
          </Text>
        </View>

        <View style={tw`flex-row gap-x-1`}>
          <Text style={tw`text-green-600`}>{item.date.gregorian.day}</Text>
          <Text style={tw`text-green-600`}>
            {gethijrimonths(item.date.hijri.month.number)}
          </Text>
        </View>
      </View>
      <View style={tw`flex-row border-b w-full px-8 justify-between`}>
        <View style={tw`items-center`}>
          <Text style={tw`font-light`}>Imsak</Text>
          <Text style={tw`font-medium`}>
            {item.timings.Imsak.substring(0, 5)}
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`font-light`}>Günəş</Text>
          <Text style={tw`font-medium`}>
            {item.timings.Sunrise.substring(0, 5)}
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`font-light`}>Günorta</Text>
          <Text style={tw`font-medium`}>
            {item.timings.Dhuhr.substring(0, 5)}
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`font-light`}>İkindi</Text>
          <Text style={tw`font-medium`}>
            {item.timings.Asr.substring(0, 5)}
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`font-light`}>Axşam</Text>
          <Text style={tw`font-medium`}>
            {item.timings.Maghrib.substring(0, 5)}
          </Text>
        </View>
        <View style={tw`items-center`}>
          <Text style={tw`font-light`}>Yatsı</Text>
          <Text style={tw`font-medium`}>
            {item.timings.Isha.substring(0, 5)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        alignItems: "center",
        paddingBottom: insets.bottom,
      }}
    >
      <Text style={tw`font-bold text-2xl mt-6`}>Jumma</Text>
      <View style={tw`mt-5 mb-4 w-full flex-row justify-center items-center`}>
        <TouchableOpacity
          style={tw`border h-12 w-[43%] rounded-md flex items-center justify-center border-green-600 bg-green-100`}
        >
          <Text style={tw`text-2xl font-semibold`}>{t("ayliq")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("mainpage")}
          style={tw`border h-12 w-[43%] rounded-md ml-6 flex items-center justify-center`}
        >
          <Text style={tw`text-2xl font-semibold`}>{sheher}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={next30days}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Ayliqvaxtlar;
