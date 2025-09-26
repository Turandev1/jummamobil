import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import Mainpage from "../Screens/app/main/mainpage";
import Profilepage from "../Screens/app/profile/profilepage";
import Quran from "../Screens/app/Quran/quran";
import Market from "../Screens/app/market/market";
import Mosque from "../Screens/app/Mosques/mosque";
import Hesabisil from "../Screens/app/profile/hesabisil";
import Sifrenideyis from "../Screens/app/profile/sifrenideyis";
import Bizimleelaqe from "../Screens/app/profile/bizimleelaqe";
import Profilredakte from "../Screens/app/profile/profilredakte";
import Diller from "../Screens/app/profile/diller";
import Locationpage from "../Screens/app/profile/locationpage";
import Notifications from "../Screens/app/main/notifications";
import Bildirisidare from "../Screens/app/profile/bildirisidare";
import Ayliqvaxtlar from "../Screens/app/main/ayliqvaxtlar";
import Iane from "../Screens/app/main/iane";
import Surahdetails from "../Screens/app/Quran/surahdetails";
import Sifreniunutdum from "../Screens/app/profile/sifreniunutdum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import tw from "twrnc";
import Imampanel from "../Screens/app/profile/admin/imampanel";
import Loginpage from "../Screens/app/profile/admin/loginpage";

const Stack = createNativeStackNavigator();

export default function Normaluser() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLastScreen = async () => {
      const lastScreen = await AsyncStorage.getItem("LASTSCREEN");
      setInitialRoute(lastScreen || "mainpage");
      setLoading(false);
    };
    loadLastScreen();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="mainpage"
        component={Mainpage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Profilepage}
        name="profilepage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={Quran}
        name="quran"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="market"
        options={{ headerShown: false }}
        component={Market}
      />
      <Stack.Screen
        name="mosque"
        options={{ headerShown: false }}
        component={Mosque}
      />
      <Stack.Screen
        component={Hesabisil}
        name="hesabisil"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Sifrenideyis}
        name="sifrenideyis"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Bizimleelaqe}
        name="bizimleelaqe"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Profilredakte}
        name="profilredakte"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="diller"
        component={Diller}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="locationpage"
        component={Locationpage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerShown: false }}
        component={Notifications}
      />
      <Stack.Screen
        component={Bildirisidare}
        name="bildirisidare"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ayliqvaxtlar"
        component={Ayliqvaxtlar}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="iane"
        component={Iane}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="surahdetails"
        component={Surahdetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgotpassword"
        component={Sifreniunutdum}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="loginpage"
        component={Loginpage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="imampanel"
        component={Imampanel}
        options={{ headerShown: false }}
      />
   
    </Stack.Navigator>
  );
}
