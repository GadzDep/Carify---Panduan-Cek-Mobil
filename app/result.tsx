import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Home,
  Pencil,
  Share2,
  XCircle,
} from "lucide-react-native";
import { useEffect, useState } from "react"; // Tambahkan useEffect di sini
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressBar } from "@/components/ProgressBar";
import { ScoreRing } from "@/components/ScoreRing";
import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";

import {
  formatDate,
  getScoreColor,
  getStatusLabel,
} from "@/utils/calculations";
import { generateInspectionHTML } from "@/utils/pdfGenerator";

export default function ResultScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { currentInspection, calculateResult, setInspectionById } =
    useInspection();

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  // ---> PERBAIKAN: Gunakan useEffect untuk set inspection berdasarkan ID <---
  useEffect(() => {
    if (id) {
      setInspectionById(id);
    }
  }, [id, setInspectionById]);

  // Gunakan currentInspection yang sudah dipaksa update oleh useEffect
  const inspection = currentInspection;

  const photos =
    inspection?.categories?.flatMap((cat) =>
      (cat.items || [])
        .filter((item) => item?.photoUri)
        .map((item) => ({
          uri: item.photoUri!,
          question: item.question || "Foto Pengecekan",
        })),
    ) || [];

  if (!inspection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ fontFamily: "PoppinsRegular" }}>
            Data pengecekan tidak ditemukan
          </Text>
          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={styles.linkText}>Kembali ke Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const result = calculateResult(inspection);
  const status = getStatusLabel(result.status);

  const handleShare = async () => {
    const message =
      `Hasil Pengecekan CARIFY\n\n` +
      `${inspection.carData.brand} ${inspection.carData.type} (${inspection.carData.year})\n` +
      `Skor: ${Math.round(result.percentage)}%\n` +
      `Status: ${status.label}\n\n` +
      `Dicek pada: ${formatDate(inspection.createdAt)}`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleExportPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);

    try {
      // 1. Generate HTML
      const html = await generateInspectionHTML(inspection, result, photos);

      // 2. Langsung Print ke PDF (Akan otomatis masuk folder aman bawaan Expo)
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // 3. Jaga-jaga kalau dibuka di web
      if (Platform.OS === "web") {
        window.open(uri, "_blank");
        setIsGeneratingPDF(false);
        return;
      }

      // 4. LANGSUNG SHARE URI ASLINYA! Tanpa ribet dipindah atau di-rename.
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Simpan Laporan PDF",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Gagal", "Fitur berbagi tidak tersedia di perangkat ini.");
      }
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      Alert.alert(
        "Gagal Export PDF",
        `Terjadi kesalahan: ${error?.message || "Silakan coba lagi."}`,
        [{ text: "OK" }],
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/history")} // ⭐ Diubah ke halaman riwayat
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasil Pengecekan</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.replace("/")}
            style={styles.iconBtn}
          >
            <Home size={20} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Share2 size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Score Card */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.scoreCard}
        >
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Skor Pengecekan</Text>
            <Text style={styles.scoreDate}>
              {formatDate(inspection.createdAt)}
            </Text>
          </View>

          <View style={styles.scoreMain}>
            <ScoreRing score={result.percentage} size={140} strokeWidth={12} />
            <View style={styles.statusContainer}>
              <Text style={styles.statusEmoji}>{status.emoji}</Text>
              <Text style={[styles.statusLabel, { color: "white" }]}>
                {status.label}
              </Text>
              {result.hasCriticalIssue && (
                <View style={styles.criticalBadge}>
                  <AlertTriangle size={14} color={Colors.warning} />
                  <Text style={styles.criticalText}>Risiko Tinggi</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.carInfo}>
            <Text style={styles.carName}>
              {inspection.carData.brand} {inspection.carData.type}
            </Text>
            <Text style={styles.carDetails}>
              {inspection.carData.year} • {inspection.carData.color} •{" "}
              {inspection.carData.plateNumber}
            </Text>
          </View>
        </LinearGradient>

        {/* Seller Issues */}
        {result.sellerIssues && result.sellerIssues.length > 0 && (
          <View style={styles.section}>
            <View style={styles.warningCard}>
              <AlertTriangle size={24} color={Colors.warning} />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>
                  Ketidaksesuaian Terdeteksi
                </Text>
                {result.sellerIssues.map((issue, idx) => (
                  <Text key={idx} style={styles.warningText}>
                    • {issue}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Critical Issues */}
        {result.criticalIssues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Masalah Kritis</Text>
            {result.criticalIssues.map((issue, idx) => (
              <View key={idx} style={styles.criticalItem}>
                <XCircle size={18} color={Colors.danger} />
                <Text style={styles.criticalItemText}>{issue}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Category Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Detail per Kategori</Text>
          {result.categoryScores.map((cat) => (
            <View key={cat.categoryId} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{cat.categoryName}</Text>
                <Text
                  style={[
                    styles.categoryScore,
                    { color: getScoreColor(cat.percentage) },
                  ]}
                >
                  {Math.round(cat.percentage)}%
                </Text>
              </View>
              <ProgressBar
                progress={cat.percentage}
                total={100}
                color={getScoreColor(cat.percentage)}
                showPercentage={false}
              />
              <Text style={styles.categoryWeight}>
                Bobot: {Math.round(cat.weight * 100)}%
              </Text>
            </View>
          ))}
        </View>

        {/* 📸 GALERI FOTO */}
        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📸 Foto Pengecekan ({photos.length})
            </Text>

            <View style={styles.galleryGrid}>
              {photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedPhoto(photo)}
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.galleryImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Rekomendasi</Text>
          <View style={styles.recommendationCard}>
            {result.percentage >= 85 ? (
              <>
                <CheckCircle2 size={32} color={Colors.success} />
                <Text style={styles.recommendationTitle}>
                  Mobil Sangat Layak
                </Text>
                <Text style={styles.recommendationText}>
                  Mobil ini dalam kondisi sangat baik dan sangat
                  direkomendasikan untuk dibeli. Lakukan pemeriksaan mekanik
                  sebagai langkah terakhir untuk memastikan.
                </Text>
              </>
            ) : result.percentage >= 70 ? (
              <>
                <CheckCircle2 size={32} color={Colors.warning} />
                <Text style={styles.recommendationTitle}>
                  Layak Dipertimbangkan
                </Text>
                <Text style={styles.recommendationText}>
                  Mobil ini dalam kondisi cukup baik dengan beberapa catatan
                  kecil. Negosiasi harga berdasarkan hasil pengecekan.
                </Text>
              </>
            ) : result.percentage >= 50 ? (
              <>
                <AlertCircle size={32} color={Colors.warning} />
                <Text style={styles.recommendationTitle}>Perlu Negosiasi</Text>
                <Text style={styles.recommendationText}>
                  Terdapat beberapa masalah yang perlu diperhatikan.
                  Pertimbangkan biaya perbaikan dalam penawaran harga.
                </Text>
              </>
            ) : (
              <>
                <XCircle size={32} color={Colors.danger} />
                <Text style={styles.recommendationTitle}>
                  Tidak Direkomendasikan
                </Text>
                <Text style={styles.recommendationText}>
                  Terdapat banyak masalah serius. Disarankan mencari alternatif
                  lain kecuali harga sangat murah dan Anda siap memperbaiki.
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              isGeneratingPDF && styles.actionBtnDisabled,
            ]}
            onPress={handleExportPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <FileText size={20} color={Colors.primary} />
            )}
            <Text
              style={[
                styles.actionBtnText,
                isGeneratingPDF && styles.actionBtnTextDisabled,
              ]}
            >
              {isGeneratingPDF ? "Membuat PDF..." : "Export PDF"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              if (inspection?.id) {
                setInspectionById(inspection.id);
              }
              router.push({
                pathname: "/car-form",
                params: { id: inspection.id },
              });
            }}
          >
            <Pencil size={20} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Edit Pengecekan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => router.push("/car-form")}
          >
            <Text style={styles.actionBtnTextPrimary}>Cek Mobil Lain</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* PREVIEW FOTO */}
      {selectedPhoto && (
        <View style={styles.photoModal}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedPhoto(null)}
          >
            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontFamily: "PoppinsBold",
              }}
            >
              ✕
            </Text>
          </TouchableOpacity>

          <Image
            source={{ uri: selectedPhoto.uri }}
            style={styles.fullPhoto}
            resizeMode="contain"
          />

          <Text style={styles.photoCaption}>{selectedPhoto.question}</Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  linkText: {
    color: Colors.primary,
    fontFamily: "PoppinsSemiBold", // Diganti
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
    color: Colors.text,
    fontFamily: "PoppinsBold", // Diganti
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    padding: 8,
  },
  scoreCard: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  scoreTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  scoreDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "PoppinsBold", // Diganti
  },
  scoreMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 24,
  },
  statusContainer: {
    flex: 1,
    gap: 8,
  },
  statusEmoji: {
    fontSize: 32,
    fontFamily: "PoppinsRegular", // Diganti
  },
  statusLabel: {
    fontSize: 18,
    fontFamily: "PoppinsBold", // Diganti
  },
  criticalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  criticalText: {
    fontSize: 12,
    color: Colors.warning,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  carInfo: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 16,
  },
  carName: {
    fontSize: 18,
    color: "white",
    marginBottom: 4,
    fontFamily: "PoppinsBold", // Diganti
  },
  carDetails: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "PoppinsMedium", // Diganti
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    fontFamily: "PoppinsBold", // Diganti
  },
  warningCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.warning + "15",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.warning + "30",
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    color: Colors.warning,
    marginBottom: 8,
    fontFamily: "PoppinsBold", // Diganti
  },
  warningText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontFamily: "PoppinsMedium", // Diganti
  },
  criticalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.danger + "10",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  criticalItemText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    fontFamily: "PoppinsMedium", // Diganti
  },
  categoryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  categoryScore: {
    fontSize: 18,
    fontFamily: "PoppinsBold", // Diganti
  },
  categoryWeight: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    fontFamily: "PoppinsMedium", // Diganti
  },
  recommendationCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recommendationTitle: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: "PoppinsBold", // Diganti
  },
  recommendationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "PoppinsMedium", // Diganti
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionBtnText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "PoppinsSemibold", // Diganti
  },
  actionBtnTextPrimary: {
    fontSize: 16,
    color: "white",
    fontFamily: "PoppinsBold", // Diganti
  },
  actionBtnDisabled: {
    opacity: 0.7,
  },
  actionBtnTextDisabled: {
    opacity: 0.7,
  },
  bottomPadding: {
    height: 40,
  },
  galleryContainer: {
    marginTop: 24,
  },
  galleryTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: "PoppinsBold", // Diganti
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  photoModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullPhoto: {
    width: "90%",
    height: "70%",
  },
  photoCaption: {
    color: "white",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "PoppinsMedium", // Diganti
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});
