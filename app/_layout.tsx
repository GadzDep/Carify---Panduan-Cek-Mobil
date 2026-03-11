import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { View, Text } from "react-native";
import { InspectionProvider } from "@/context/InspectionContext";

export default function RootLayout() {
const [fontsLoaded] = useFonts({
  PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
  PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  PoppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
});

  if (!fontsLoaded) {
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <InspectionProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </InspectionProvider>
  );
}