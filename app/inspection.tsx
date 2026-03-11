import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  HelpCircle,
  X,
  Check,
  Minus,
  AlertTriangle,
} from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";
import { useState, useRef, useEffect } from "react";
import { AnswerValue } from "@/types/inspection";
import { RiskBadge } from "@/components/RiskBadge";
import { ProgressBar } from "@/components/ProgressBar";
import * as ImagePicker from "expo-image-picker";

// Bikin referensi target urutan ID yang paten
const TARGET_ORDER = ["legal", "exterior", "interior", "engine"];

// Mapping icon supaya tetap cantik sesuai ID kategori
const CATEGORY_ICONS: Record<string, string> = {
  legal: "📄",
  exterior: "🚗",
  interior: "🪑",
  engine: "⚙️",
};

const ANSWER_OPTIONS: {
  value: AnswerValue;
  label: string;
  icon: (color: string) => React.ReactNode;
  color: string;
}[] = [
  {
    value: "yes",
    label: "Ya",
    icon: (color) => <Check size={16} color={color} />,
    color: Colors.success,
  },
  {
    value: "doubt",
    label: "Ragu",
    icon: (color) => <Minus size={16} color={color} />,
    color: Colors.warning,
  },
  {
    value: "no",
    label: "Tidak",
    icon: (color) => <X size={16} color={color} />,
    color: Colors.danger,
  },
];

export default function InspectionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const {
    currentInspection,
    setInspectionById,
    updateChecklistItem,
    saveInspection,
  } = useInspection();

  const exitInspection = async () => {
    await saveInspection();
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<Record<string, number>>({});

  // ⭐ PERBAIKAN UTAMA: Jangan jalankan setInspectionById kalau ID yang dikirim
  // sama dengan ID dari draft yang sedang berjalan (currentInspection).
  // Ini mencegah bug "Memuat pengecekan..." terus-terusan karena data baru keriset!
  useEffect(() => {
    if (id && currentInspection?.id !== id) {
      setInspectionById(id as string);
    }
  }, [id, currentInspection?.id]);

  // ⭐ PERBAIKAN TAMBAHAN: Jaring pengaman tampilan loading
  if (!currentInspection) {
    return (
      <View style={styles.center}>
        {!id ? (
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text
              style={{
                color: Colors.danger,
                fontFamily: "PoppinsBold", // Diganti
              }}
            >
              Error: ID Pengecekan tidak ditemukan!
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8 }}
            >
              <Text
                style={{ color: Colors.primary, fontFamily: "PoppinsRegular" }}
              >
                Kembali
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ fontFamily: "PoppinsRegular" }}>
            Memuat pengecekan...
          </Text>
        )}
      </View>
    );
  }

  // Sortir data asli secara dinamis berdasar TARGET_ORDER
  const sortedCategories = [...currentInspection.categories].sort((a, b) => {
    return TARGET_ORDER.indexOf(a.id) - TARGET_ORDER.indexOf(b.id);
  });

  const currentCategory = sortedCategories[currentCategoryIndex];

  const totalItems = sortedCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );

  const completedItems = sortedCategories.reduce(
    (sum, cat) => sum + cat.items.filter((item) => item.answer).length,
    0,
  );

  const handleAnswer = (
    categoryId: string,
    itemId: string,
    answer: AnswerValue,
  ) => {
    updateChecklistItem(categoryId, itemId, { answer });
  };

  const handleNoteChange = (
    categoryId: string,
    itemId: string,
    note: string,
  ) => {
    updateChecklistItem(categoryId, itemId, { note });
  };

  const handleTakePhoto = async (categoryId: string, itemId: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Aplikasi membutuhkan izin kamera untuk mengambil foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateChecklistItem(categoryId, itemId, {
        photoUri: result.assets[0].uri,
      });
    }
  };

  const handleNext = () => {
    if (currentCategoryIndex < sortedCategories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    } else {
      Alert.alert(
        "Keluar Pengecekan?",
        "Tenang saja, progress anda tetap akan disimpan.",
        [
          { text: "Tetap di sini", style: "cancel" },
          { text: "Keluar", style: "destructive", onPress: exitInspection },
        ],
      );
    }
  };

  const scrollToFirstUnanswered = () => {
    for (let catIndex = 0; catIndex < sortedCategories.length; catIndex++) {
      const category = sortedCategories[catIndex];

      for (const item of category.items) {
        if (!item.answer) {
          if (catIndex !== currentCategoryIndex) {
            setCurrentCategoryIndex(catIndex);
          }

          setTimeout(() => {
            const y = itemPositions.current[item.id];

            if (y !== undefined) {
              scrollViewRef.current?.scrollTo({
                y: y - 20,
                animated: true,
              });
            }
          }, 250);

          return;
        }
      }
    }
  };

  const handleFinish = () => {
    const unansweredItems = sortedCategories.flatMap((cat) =>
      cat.items.filter((item) => !item.answer).map((item) => item.question),
    );

    if (unansweredItems.length > 0) {
      Alert.alert(
        "Item Belum Lengkap",
        `Ada ${unansweredItems.length} pertanyaan yang belum dijawab. Lanjutkan?`,
        [
          { text: "Lengkapi Dulu", onPress: scrollToFirstUnanswered },
          { text: "Lanjutkan", onPress: completeInspection },
        ],
      );
    } else {
      completeInspection();
    }
  };

  const completeInspection = async () => {
    await saveInspection();
    router.replace({ pathname: "/result", params: { id } });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{currentCategory.name}</Text>
          <Text style={styles.headerSubtitle}>
            {currentCategoryIndex + 1} dari {sortedCategories.length}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={completedItems} total={totalItems} />
        <Text style={styles.progressText}>
          {completedItems}/{totalItems}
        </Text>
      </View>

      {/* Kategori (Steps) */}
      <View style={styles.stepsContainer}>
        {sortedCategories.map((cat, index) => (
          <View key={cat.id} style={styles.stepWrapper}>
            <View
              style={[
                styles.step,
                index === currentCategoryIndex && styles.stepActive,
                index < currentCategoryIndex && styles.stepCompleted,
              ]}
            >
              <Text style={styles.stepIcon}>
                {CATEGORY_ICONS[cat.id] || "📌"}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                index === currentCategoryIndex && styles.stepLabelActive,
              ]}
            >
              {cat.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Checklist Items */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentCategory.items.map((item, index) => (
          <View
            key={item.id}
            style={styles.itemCard}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              itemPositions.current[item.id] = y;
            }}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemNumber}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemQuestion}>{item.question}</Text>
                <RiskBadge level={item.riskIndicator} size="small" />
              </View>
              <TouchableOpacity
                onPress={() =>
                  setShowTooltip(showTooltip === item.id ? null : item.id)
                }
                style={styles.tooltipBtn}
              >
                <HelpCircle size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {showTooltip === item.id && (
              <View style={styles.tooltip}>
                <AlertTriangle size={16} color={Colors.warning} />
                <Text style={styles.tooltipText}>{item.tooltip}</Text>
              </View>
            )}

            <View style={styles.answerContainer}>
              {ANSWER_OPTIONS.map((option) => {
                const isActive = item.answer === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.answerBtn,
                      isActive && {
                        backgroundColor: option.color,
                        borderColor: option.color,
                      },
                    ]}
                    onPress={() =>
                      handleAnswer(currentCategory.id, item.id, option.value)
                    }
                  >
                    {option.icon(isActive ? "white" : Colors.textSecondary)}
                    <Text
                      style={[
                        styles.answerLabel,
                        isActive && styles.answerLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.noteInput}
              placeholder="Tambahkan catatan (opsional)"
              placeholderTextColor={Colors.textMuted}
              multiline
              value={item.note || ""}
              onChangeText={(text) =>
                handleNoteChange(currentCategory.id, item.id, text)
              }
            />

            <TouchableOpacity
              style={styles.photoBtn}
              onPress={() => handleTakePhoto(currentCategory.id, item.id)}
            >
              {item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.photoPreview}
                />
              ) : (
                <>
                  <Camera size={20} color={Colors.primary} />
                  <Text style={styles.photoText}>Tambah Foto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navBtn} onPress={handleBack}>
          <Text style={styles.navBtnText}>
            {currentCategoryIndex === 0 ? "Batal" : "Sebelumnya"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnPrimary]}
          onPress={handleNext}
        >
          <Text style={[styles.navBtnText, styles.navBtnTextPrimary]}>
            {currentCategoryIndex === sortedCategories.length - 1
              ? "Selesai"
              : "Selanjutnya"}
          </Text>
          <ChevronRight size={18} color="white" />
        </TouchableOpacity>
      </View>
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
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: "PoppinsBold", // Diganti
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    fontFamily: "PoppinsMedium", // Diganti
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  progressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepWrapper: {
    alignItems: "center",
    gap: 6,
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "15",
  },
  stepCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepIcon: {
    fontSize: 20,
    fontFamily: "PoppinsMedium", // Diganti
  },
  stepLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "PoppinsMedium", // Diganti
  },
  stepLabelActive: {
    color: Colors.primary,
    fontFamily: "PoppinsSemiBold", // Diganti (fontWeight dihapus)
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  itemCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  itemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  itemNumberText: {
    fontSize: 13,
    color: "white",
    fontFamily: "PoppinsBold", // Diganti
  },
  itemTitleContainer: {
    flex: 1,
    gap: 6,
  },
  itemQuestion: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  tooltipBtn: {
    padding: 4,
  },
  tooltip: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.warning + "15",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  tooltipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontFamily: "PoppinsMedium", // Diganti
  },
  answerContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  answerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  answerLabel: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  answerLabelActive: {
    color: "white",
  },
  noteInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 12,
    fontFamily: "PoppinsMedium", // Diganti
  },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  photoText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  photoPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  navBtnPrimary: {
    flex: 1.5,
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  navBtnText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: "PoppinsSemiBold", // Diganti
  },
  navBtnTextPrimary: {
    color: "white",
  },
});
