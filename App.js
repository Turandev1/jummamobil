import { Image, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Authnavigation from "./src/navigation/autnavigation";
import { useContext, useEffect, useState } from "react";
import Normaluser from "./src/navigation/normaluser";
import "./i18n";
import ErrorBoundary from "./src/components/errorboundary";
import { AppProvider } from "./src/context/appcontext";
import { AuthContext, AuthProvider, useAuth } from "./src/context/authcontext";
import tw from "twrnc";
import * as Notifications from "expo-notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryProvider } from "./src/config/queryclient";
import NotificationService, {
  navigationref,
} from "./src/services/notifications/notificationservice";
import { NotificationProvider } from "./src/context/notificationcontext";

// Global error handler
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.log("🔥 Global Error Handler");
  console.log("📛 Error message:", error.message);
  console.log("📄 Stack trace:\n", error.stack);
  if (isFatal) {
    console.log("💥 FATAL ERROR");
  }
});

const App = () => {
  
 

  const Rootnavigator = () => {
    const { isAuth } = useAuth();
    if (isAuth === null) {
      return (
        // Yükleniyor ekranı
        <View
          style={tw`flex-1 items-center justify-center bg-blue-200 flex-row`}
        >
          <Text style={tw`text-2xl font-extrabold text-green-700`}>Jumma</Text>
        </View>
      );
    }
    return isAuth ? <Normaluser /> : <Authnavigation />;
  };

  return (
    <QueryProvider>
      <AppProvider>
        <AuthProvider>
          <ErrorBoundary
            onError={(error, info) => {
              // Burada loglama servisine gönderebilirsin
              console.log("🔔 Loglandı:", error);
            }}
          >
            <NotificationProvider>
              <NavigationContainer ref={navigationref}>
                <Rootnavigator />
              </NavigationContainer>
            </NotificationProvider>
          </ErrorBoundary>
        </AuthProvider>
      </AppProvider>
    </QueryProvider>
  );
};

export default App;
