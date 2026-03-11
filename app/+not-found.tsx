import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Halaman Tidak Ditemukan</Text>
        <Text style={styles.subtitle}>
          Maaf, halaman yang Anda cari tidak tersedia.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Kembali ke Beranda</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Poppins",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: "Poppins",
  },
});
