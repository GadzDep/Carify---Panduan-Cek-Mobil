import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import { ChevronLeft, BarChart3, Check, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";
import { useState } from "react";
import { getScoreColor, formatDate } from "@/utils/calculations";
import { ScoreRing } from "@/components/ScoreRing"; // Jangan lupa import ScoreRing

export default function CompareScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { inspections, calculateResult } = useInspection();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        Alert.alert(
          "Maksimum 3 Mobil",
          "Anda hanya dapat membandingkan maksimal 3 mobil sekaligus.",
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  if (!inspections) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Memuat data...</Text>
      </SafeAreaView>
    );
  }

  const selectedInspections = inspections.filter((i) =>
    selectedIds.includes(i.id),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bandingkan Mobil</Text>
        <View style={styles.placeholder} />
      </View>

      {selectedInspections.length >= 2 ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.comparisonHeader}>
            <BarChart3 size={24} color={Colors.primary} />
            <Text style={styles.comparisonTitle}>
              Perbandingan {selectedInspections.length} Mobil
            </Text>
          </View>

          {/* Comparison Table */}
          <View style={styles.table}>
            {/* Headers */}
            <View style={styles.tableRow}>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableHeaderText}>Kriteria</Text>
              </View>
              {selectedInspections.map((inspection) => (
                <View key={inspection.id} style={styles.tableCellHeader}>
                  <Text style={styles.tableHeaderText} numberOfLines={2}>
                    {inspection.carData.brand}
                  </Text>
                </View>
              ))}
            </View>

            {/* Rows */}
            {[
              { label: "Tipe", key: "type" as const },
              { label: "Tahun", key: "year" as const },
              { label: "KM", key: "mileage" as const },
            ].map((row) => (
              <View key={row.key} style={styles.tableRow}>
                <View style={styles.tableCellLabel}>
                  <Text style={styles.tableLabelText}>{row.label}</Text>
                </View>
                {selectedInspections.map((inspection) => (
                  <View key={inspection.id} style={styles.tableCell}>
                    <Text style={styles.tableCellText}>
                      {inspection.carData[row.key]}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Score Row */}
            <View style={[styles.tableRow, styles.scoreRow]}>
              <View style={styles.tableCellLabel}>
                <Text style={styles.tableLabelText}>Skor</Text>
              </View>
              {selectedInspections.map((inspection) => {
                const result = calculateResult(inspection);
                const scoreColor = getScoreColor(result.percentage);
                return (
                  <View key={inspection.id} style={styles.tableCell}>
                    <LinearGradient
                      colors={[scoreColor, scoreColor + "DD"]}
                      style={styles.scoreBadge}
                    >
                      <Text style={styles.scoreBadgeText}>
                        {Math.round(result.percentage)}%
                      </Text>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>

            {/* Status Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCellLabel}>
                <Text style={styles.tableLabelText}>Status</Text>
              </View>
              {selectedInspections.map((inspection) => {
                const result = calculateResult(inspection);
                return (
                  <View key={inspection.id} style={styles.tableCell}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: getScoreColor(result.percentage) },
                      ]}
                    >
                      {result.percentage >= 85
                        ? "⭐ Direkomendasikan"
                        : result.percentage >= 70
                          ? "✓ Dipertimbangkan"
                          : result.percentage >= 50
                            ? "! Negosiasi"
                            : "✗ Tidak Direkomendasikan"}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Critical Issues Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCellLabel}>
                <Text style={styles.tableLabelText}>Masalah Kritis</Text>
              </View>
              {selectedInspections.map((inspection) => {
                const result = calculateResult(inspection);
                return (
                  <View key={inspection.id} style={styles.tableCell}>
                    {result.hasCriticalIssue ? (
                      <View style={styles.criticalBadgeSmall}>
                        <X size={12} color={Colors.danger} />
                        <Text style={styles.criticalBadgeText}>
                          {result.criticalIssues.length} masalah
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.goodBadge}>
                        <Check size={12} color={Colors.success} />
                        <Text style={styles.goodBadgeText}>Aman</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Winner Banner */}
          {(() => {
            const results = selectedInspections.map((i) => ({
              inspection: i,
              result: calculateResult(i),
            }));
            const winner = results.reduce((best, current) =>
              current.result.percentage > best.result.percentage
                ? current
                : best,
            );

            return (
              <View style={styles.winnerCard}>
                <Text style={styles.winnerLabel}>🏆 Rekomendasi Terbaik</Text>
                <Text style={styles.winnerName}>
                  {winner.inspection.carData.brand}{" "}
                  {winner.inspection.carData.type}
                </Text>
                <Text style={styles.winnerScore}>
                  Skor: {Math.round(winner.result.percentage)}%
                </Text>
              </View>
            );
          })()}

          <View style={styles.bottomPadding} />
        </ScrollView>
      ) : (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>
            Pilih 2 Mobil untuk Dibandingkan
          </Text>
          <Text style={styles.selectionSubtitle}>
            Ketuk untuk memilih mobil yang ingin Anda bandingkan
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {inspections?.map((inspection) => {
              const result = calculateResult(inspection);
              const isSelected = selectedIds.includes(inspection.id);
              const scoreColor = getScoreColor(result.percentage);

              return (
                <TouchableOpacity
                  key={inspection.id}
                  style={[
                    styles.historyCard,
                    isSelected && styles.historyCardSelected,
                  ]}
                  onPress={() => toggleSelection(inspection.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.carName} numberOfLines={1}>
                        {inspection.carData.brand} {inspection.carData.type}
                      </Text>
                      <Text style={styles.carDetails}>
                        {inspection.carData.year} • {inspection.carData.plateNumber}
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
                    <View style={styles.riskBanner}>
                      <Text style={styles.riskText}>⚠️ Risiko Tinggi</Text>
                    </View>
                  )}

                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Check size={14} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {inspections.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Belum ada riwayat pengecekan
                </Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => router.push("/car-form")}
                >
                  <Text style={styles.emptyBtnText}>Mulai Pengecekan</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>
        </View>
      )}

      {selectedIds.length >= 2 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => setSelectedIds([])}
          >
            <Text style={styles.resetBtnText}>Pilih Ulang</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
    fontFamily: "Poppins",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  selectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins",
  },
  // Style Baru untuk Kad seperti di HistoryScreen
  historyCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative",
  },
  historyCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "05",
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardLeft: {
    flex: 1,
  },
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
  cardRight: {
    alignItems: "center",
    marginLeft: 10,
    marginRight: 8, // Memberi ruang supaya tak tertutup badge
  },
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
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontFamily: "Poppins",
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    fontFamily: "Poppins",
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    fontFamily: "Poppins",
  },
  table: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableCellHeader: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  tableCellLabel: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.background,
    justifyContent: "center",
  },
  tableLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    fontFamily: "Poppins",
  },
  tableCell: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tableCellText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  scoreRow: {
    backgroundColor: Colors.background,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    fontFamily: "Poppins",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  criticalBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.danger + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  criticalBadgeText: {
    fontSize: 10,
    color: Colors.danger,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  goodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.success + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goodBadgeText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  winnerCard: {
    backgroundColor: Colors.primary + "15",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  winnerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  winnerName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  winnerScore: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: "Poppins",
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resetBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "Poppins",
  },
  bottomPadding: {
    height: 40,
  },
});