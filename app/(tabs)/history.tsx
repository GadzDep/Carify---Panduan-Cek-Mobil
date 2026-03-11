import { ScoreRing } from "@/components/ScoreRing";
import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";
import { formatDate, getScoreColor } from "@/utils/calculations";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import {
  BarChart3,
  CheckSquare,
  ChevronLeft,
  Plus,
  Square,
} from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { inspections, deleteInspection, calculateResult } = useInspection();

  const handleBack = () => {
    if (selectMode) {
      setSelectMode(false);
      setSelectedIds([]);
    } else if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === inspections.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(inspections.map((i) => i.id));
    }
  };

  // <-- 2. Perbaiki fungsi handleDeleteSelected
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    // Pisahkan fungsi eksekusi hapus
    const executeDelete = async () => {
      try {
        // Menghapus satu per satu
        for (const id of selectedIds) {
          await deleteInspection(id);
        }
        setSelectedIds([]);
        setSelectMode(false);
      } catch (error) {
        Alert.alert("Error", "Gagal menghapus beberapa data.");
      }
    };

    // Deteksi jika berjalan di Web
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm(
        `Yakin ingin menghapus ${selectedIds.length} data terpilih?`,
      );
      if (confirmDelete) {
        await executeDelete();
      }
    } else {
      // Jalan di Android / iOS
      Alert.alert(
        "Hapus Pengecekan",
        `Yakin ingin menghapus ${selectedIds.length} data terpilih?`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: executeDelete,
          },
        ],
      );
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {selectMode ? `${selectedIds.length} Terpilih` : "Semua Riwayat"}
        </Text>

        <View style={styles.headerRight}>
          {inspections.length > 0 && (
            <TouchableOpacity
              onPress={selectMode ? handleSelectAll : () => setSelectMode(true)}
              style={styles.headerActionBtn}
            >
              <Text style={styles.headerActionText}>
                {selectMode
                  ? selectedIds.length === inspections.length
                    ? "Batal Semua"
                    : "Pilih Semua"
                  : "Pilih"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Konten Scroll */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {inspections.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <BarChart3 size={48} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyText}>
              Mulai pengecekan pertama Anda untuk melihat riwayat di sini
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push("/car-form")}
            >
              <Plus size={20} color="white" />
              <Text style={styles.emptyBtnText}>Mulai Pengecekan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {!selectMode && (
              <View style={styles.statsCard}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.statsGradient}
                >
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{inspections.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                      {
                        inspections.filter(
                          (i) => calculateResult(i).percentage >= 70,
                        ).length
                      }
                    </Text>
                    <Text style={styles.statLabel}>Layak</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                      {
                        inspections.filter(
                          (i) => calculateResult(i).hasCriticalIssue,
                        ).length
                      }
                    </Text>
                    <Text style={styles.statLabel}>Risiko</Text>
                  </View>
                </LinearGradient>
              </View>
            )}

            <Text style={styles.sectionTitle}>Daftar Pengecekan</Text>

            {inspections.map((inspection) => {
              const result = calculateResult(inspection);
              const scoreColor = getScoreColor(result.percentage);
              const isSelected = selectedIds.includes(inspection.id);

              return (
                <TouchableOpacity
                  key={inspection.id}
                  style={[
                    styles.historyCard,
                    isSelected && styles.historyCardSelected,
                  ]}
                  onPress={() => {
                    if (selectMode) {
                      toggleSelect(inspection.id);
                    } else {
                      router.push({
                        pathname: "/result",
                        params: { id: inspection.id },
                      });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardContent}>
                    {selectMode && (
                      <View style={styles.checkboxWrapper}>
                        {isSelected ? (
                          <CheckSquare
                            size={24}
                            color={Colors.primary}
                            fill={Colors.primary + "20"} // Efek isi warna transparan
                          />
                        ) : (
                          <Square size={24} color={Colors.border} />
                        )}
                      </View>
                    )}

                    <View style={styles.cardLeft}>
                      <Text style={styles.carName} numberOfLines={1}>
                        {inspection.carData.brand} {inspection.carData.type}
                      </Text>
                      <Text style={styles.carDetails}>
                        {inspection.carData.year} •{" "}
                        {inspection.carData.plateNumber}
                      </Text>
                      <Text style={styles.dateText}>
                        {formatDate(inspection.createdAt)}
                      </Text>
                    </View>

                    <View style={styles.cardRight}>
                      <ScoreRing
                        score={result.percentage}
                        size={55}
                        strokeWidth={5}
                        showLabel={false}
                      />
                      <Text style={[styles.scoreText, { color: scoreColor }]}>
                        {Math.round(result.percentage)}%
                      </Text>
                    </View>
                  </View>

                  {result.hasCriticalIssue && (
                    <View
                      style={[
                        styles.riskBanner,
                        selectMode && { marginLeft: 40 },
                      ]}
                    >
                      <Text style={styles.riskText}>⚠️ Risiko Tinggi</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Footer Floating */}
      {inspections.length > 0 && (
        <View style={styles.footer}>
          {selectMode ? (
            <View style={styles.footerButtonGroup}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setSelectMode(false);
                  setSelectedIds([]);
                }}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteActionBtn,
                  selectedIds.length === 0 && styles.deleteActionBtnDisabled,
                ]}
                onPress={handleDeleteSelected}
                disabled={selectedIds.length === 0}
              >
                <Text style={styles.deleteActionText}>
                  Hapus{" "}
                  {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.compareBtn}
              onPress={() => router.push("/compare")}
            >
              <BarChart3 size={20} color="white" />
              <Text style={styles.compareBtnText}>Bandingkan Mobil</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    fontSize: 18,
    color: Colors.text,
    fontFamily: "PoppinsBold",
  },
  headerRight: { minWidth: 100, alignItems: "flex-end" },
  headerActionBtn: { padding: 8 },
  headerActionText: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  content: { flex: 1, paddingHorizontal: 20 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.text,
    marginBottom: 8,
    fontFamily: "PoppinsBold",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "PoppinsMedium",
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyBtnText: {
    fontSize: 16,
    color: "white",
    fontFamily: "PoppinsBold",
  },
  statsCard: { marginBottom: 24, borderRadius: 20, overflow: "hidden" },
  statsGradient: { flexDirection: "row", padding: 20 },
  stat: { flex: 1, alignItems: "center" },
  statNumber: {
    fontSize: 24,
    color: "white",
    fontFamily: "PoppinsExtraBold",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    fontFamily: "PoppinsBold",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    fontFamily: "PoppinsBold",
  },
  historyCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "05",
  },
  cardContent: { flexDirection: "row", alignItems: "center" },
  checkboxWrapper: { marginRight: 16 },
  cardLeft: { flex: 1 },
  carName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
    fontFamily: "PoppinsBold",
  },
  carDetails: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontFamily: "PoppinsMedium",
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "PoppinsMedium",
  },
  cardRight: { alignItems: "center", marginLeft: 10 },
  scoreText: {
    fontSize: 13,
    marginTop: 4,
    fontFamily: "PoppinsBold",
  },
  riskBanner: {
    backgroundColor: Colors.danger + "10",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  riskText: {
    fontSize: 11,
    color: Colors.danger,
    fontFamily: "PoppinsBold",
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButtonGroup: { flexDirection: "row", gap: 12 },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
  },
  compareBtnText: {
    fontSize: 16,
    color: "white",
    fontFamily: "PoppinsBold",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "PoppinsBold",
  },
  deleteActionBtn: {
    flex: 1.5,
    backgroundColor: Colors.danger,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteActionBtnDisabled: { backgroundColor: Colors.danger + "40" },
  deleteActionText: {
    fontSize: 16,
    color: "white",
    fontFamily: "PoppinsBold",
  },
  bottomPadding: { height: 40 },
});
