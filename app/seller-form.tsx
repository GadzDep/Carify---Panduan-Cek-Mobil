import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { ChevronLeft, UserCheck, Info } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";
import { useState, useEffect } from "react";
import { SellerTransparency } from "@/types/inspection";

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}

function CheckboxItem({ label, checked, onToggle, icon }: CheckboxItemProps) {
  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, checked && styles.checkboxActive]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxLeft}>
        {icon}
        <Text
          style={[styles.checkboxLabel, checked && styles.checkboxLabelActive]}
        >
          {label}
        </Text>
      </View>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <View style={styles.checkboxInner} />}
      </View>
    </TouchableOpacity>
  );
}

export default function SellerForm() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const { currentInspection, updateSellerTransparency, getInspectionById } = useInspection();

  // Pastikan kita mengambil data dari ID yang benar (url param prioritas)
  const validId = id as string || currentInspection?.id;

  // Set default state kosong di awal
  const [sellerData, setSellerData] = useState<SellerTransparency>({
    hasAccident: false,
    hasFlood: false,
    regularService: false,
    taxActive: false,
    readyForWorkshopCheck: false,
  });

  // LOGIKA SYNC & RESET YANG DIPERBAIKI
  useEffect(() => {
    // Cari data yang relevan dengan ID di URL
    const activeData = validId && currentInspection?.id === validId 
      ? currentInspection 
      : (validId ? getInspectionById(validId) : null);

    // Cek apakah data seller transparency untuk mobil ini benar-benar ada
    if (activeData?.sellerTransparency) {
      setSellerData(activeData.sellerTransparency);
    } else {
      // JIKA KOSONG (Cek Mobil Baru), RESET FORM!
      setSellerData({
        hasAccident: false,
        hasFlood: false,
        regularService: false,
        taxActive: false,
        readyForWorkshopCheck: false,
      });
    }
  }, [validId, currentInspection?.id]); // Terpicu jika ID berubah

  const handleToggle = (key: keyof SellerTransparency) => {
    setSellerData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleBack = () => {
    updateSellerTransparency(sellerData);
    if (navigation.canGoBack()) router.back();
    else router.replace({ pathname: "/car-form", params: { id: validId } });
  };

  const handleContinue = () => {
    updateSellerTransparency(sellerData);
    router.push({ pathname: "/inspection", params: { id: validId } });
  };

  const handleSkip = () => {
    updateSellerTransparency(sellerData);
    router.push({ pathname: "/inspection", params: { id: validId } });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transparansi Penjual</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Info size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Informasi ini akan dibandingkan dengan hasil pengecekan untuk
            mendeteksi ketidaksesuaian yang mungkin terjadi.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kondisi Mobil Menurut Penjual</Text>

          <CheckboxItem
            label="Pernah mengalami tabrakan"
            checked={sellerData.hasAccident}
            onToggle={() => handleToggle("hasAccident")}
            icon={<Text style={styles.emoji}>💥</Text>}
          />

          <CheckboxItem
            label="Pernah terendam banjir"
            checked={sellerData.hasFlood}
            onToggle={() => handleToggle("hasFlood")}
            icon={<Text style={styles.emoji}>🌊</Text>}
          />

          <CheckboxItem
            label="Servis rutin di bengkel resmi"
            checked={sellerData.regularService}
            onToggle={() => handleToggle("regularService")}
            icon={<Text style={styles.emoji}>🔧</Text>}
          />

          <CheckboxItem
            label="Pajak kendaraan masih aktif"
            checked={sellerData.taxActive}
            onToggle={() => handleToggle("taxActive")}
            icon={<Text style={styles.emoji}>📋</Text>}
          />

          <CheckboxItem
            label="Siap diajak cek ke bengkel"
            checked={sellerData.readyForWorkshopCheck}
            onToggle={() => handleToggle("readyForWorkshopCheck")}
            icon={<Text style={styles.emoji}>✅</Text>}
          />
        </View>

        <View style={styles.noteBox}>
          <UserCheck size={20} color={Colors.warning} />
          <Text style={styles.noteText}>
            Jika hasil pengecekan menunjukkan indikasi berbeda dengan pernyataan
            penjual, sistem akan memberikan peringatan khusus pada laporan
            akhir.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Lanjut ke Pengecekan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: "PoppinsBold",
  },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.primary + "10",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: "PoppinsMedium",
  },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
    fontFamily: "PoppinsBold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkboxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "08",
  },
  checkboxLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  emoji: { fontSize: 24 },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "PoppinsMedium",
  },
  checkboxLabelActive: {
    color: Colors.primary,
    fontFamily: "PoppinsSemiBold",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 2,
  },
  noteBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.warning + "10",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontFamily: "PoppinsMedium",
  },
  bottomPadding: { height: 100 },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  skipText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: "PoppinsSemiBold",
  },
  continueBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueText: {
    fontSize: 16,
    color: "white",
    fontFamily: "PoppinsBold",
  },
});