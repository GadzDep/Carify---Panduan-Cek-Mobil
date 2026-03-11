import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BarChart3, Car, ClipboardCheck, Shield } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Checklist Terstruktur",
    desc: "Panduan cek lengkap per kategori",
  },
  {
    icon: BarChart3,
    title: "Skor Otomatis",
    desc: "Perhitungan risiko berbobot otomatis",
  },
  {
    icon: Shield,
    title: "Deteksi Risiko",
    desc: "Identifikasi banjir, tabrakan & masalah kritis",
  },
  {
    icon: Car,
    title: "Bandingkan Mobil",
    desc: "Perbandingan multi-kendaraan",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { deleteAllInspections } = useInspection();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Car size={40} color="white" strokeWidth={2.5} />
              <Text style={styles.logoText}>CARIFY</Text>
            </View>
            <Text style={styles.tagline}>
              Cek Mobil Jadi Lebih Mudah,{"\n"} Murah dan Hasilnya lebih Akurat
            </Text>
          </View>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang Carify</Text>
          <Text style={styles.description}>
            Carify adalah aplikasi panduan pengecekan mobil yang membantu
            pengguna, terutama pemula, memeriksa dokumen dan kondisi mobil
            sebelum membeli agar dapat mengambil keputusan dengan lebih aman dan
            tepat.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur Unggulan</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <feature.icon size={24} color={Colors.primary} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/car-form")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Mulai Cek</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
  },
  headerContent: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    color: "white",
    letterSpacing: 1,
    fontFamily: "PoppinsExtraBold", // Sesuai alias di _layout
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontFamily: "PoppinsMedium", // Sesuai alias di _layout
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
    fontFamily: "PoppinsBold", // Sesuai alias di _layout
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontFamily: "PoppinsMedium", // Menggunakan Poppins Regular (alias "Poppins")
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 4,
    fontFamily: "PoppinsBold",
  },
  featureDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    fontFamily: "PoppinsMedium",
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 18,
    color: "white",
    fontFamily: "PoppinsBold",
  },
  bottomPadding: {
    height: 40,
  },
});
