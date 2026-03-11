import { Colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import { ClipboardCheck, History } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 80,
          paddingBottom: 24,
          paddingTop: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "PoppinsSemiBold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cek Kendaraan",
          tabBarIcon: ({ color, size }) => (
            <ClipboardCheck size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
