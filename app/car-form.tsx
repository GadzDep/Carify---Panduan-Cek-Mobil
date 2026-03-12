import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Car } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useInspection } from "@/context/InspectionContext";
import { useState, useEffect, useMemo } from "react";
import { CarData } from "@/types/inspection";

const TRANSMISSION_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Otomatis" },
] as const;

const CAR_DATABASE: Record<string, string[]> = {
  Toyota: [
    "Avanza",
    "Veloz",
    "Rush",
    "Fortuner",
    "Innova Zenix",
    "Innova Reborn",
    "Yaris Cross",
    "Raize",
    "Agya",
    "Calya",
    "Alphard",
    "Vellfire",
    "Land Cruiser",
  ],
  Honda: [
    "Brio",
    "HR-V",
    "BR-V",
    "CR-V",
    "WR-V",
    "City Hatchback",
    "Civic RS",
    "Mobilio",
  ],
  Mitsubishi: [
    "Xpander",
    "Xpander Cross",
    "Pajero Sport",
    "Xforce",
    "L300",
    "Triton",
  ],
  Daihatsu: ["Xenia", "Terios", "Ayla", "Sigra", "Rocky", "Gran Max"],
  Suzuki: ["Ertiga", "XL7", "Grand Vitara", "Jimny", "Baleno", "S-Presso"],
  Wuling: ["Almaz", "Alvez", "Air EV", "Binguo EV", "Cloud EV"],
  Hyundai: ["Stargazer", "Creta", "Ioniq 5", "Ioniq 6", "Palisade", "Santa Fe"],
  Mazda: ["CX-3", "CX-5", "CX-30", "Mazda 2", "Mazda 3"],
  "Mercedes Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLA"],
  BMW: ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5"],
  "Rolls Royce": ["Phantom", "Ghost", "Cullinan", "Wraith", "Dawn", "Spectre"],
  Lamborghini: ["Aventador", "Huracan", "Urus", "Revuelto"],
  Ferrari: ["Roma", "296 GTB", "SF90", "F8", "Purosangue"],
  Porsche: ["911", "718 Cayman", "Macan", "Cayenne", "Taycan"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga"],
  "Aston Martin": ["Vantage", "DB11", "DBS", "DBX"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
};

export default function CarForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    getInspectionById,
    setInspectionById,
    updateCarData,
    createInspection,
    currentInspection,
  } = useInspection();

  const activeData = useMemo(() => {
    if (id && currentInspection?.id === id) return currentInspection;
    if (id) return getInspectionById(id as string);
    return null;
  }, [id, currentInspection, getInspectionById]);

  const [carData, setCarData] = useState<CarData>({
    brand: "",
    type: "",
    year: "",
    color: "",
    transmission: "manual",
    mileage: "",
    plateNumber: "",
  });

  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);

  // State baru untuk memunculkan error tulisan merah
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (activeData?.carData) setCarData(activeData.carData);
  }, [activeData?.id]);

  useEffect(() => {
    if (id && (!currentInspection || currentInspection.id !== id)) {
      setInspectionById(id as string);
    }
  }, [id]);

  const handleChange = (field: keyof CarData, value: string) => {
    setCarData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "brand" ? { type: "" } : {}),
    }));
    // Sembunyikan pesan error kalau user mulai ngetik lagi
    if (showErrors) setShowErrors(false);
  };

  const isFormValid =
    carData.brand.trim() !== "" &&
    carData.type.trim() !== "" &&
    carData.year.trim() !== "" &&
    carData.color.trim() !== "" &&
    carData.mileage.trim() !== "" &&
    carData.plateNumber.trim() !== "";

  const handleContinue = async () => {
    if (!isFormValid) {
      // Munculkan tulisan merah jika ada yang kosong
      setShowErrors(true);
      return;
    }

    let targetId = id as string;
    if (!targetId) {
      const newInsp = await createInspection("buy");
      targetId = newInsp.id;
    }
    await updateCarData(carData);
    router.push({ pathname: "/seller-form", params: { id: targetId } });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Mobil</Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Car size={40} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Informasi Kendaraan</Text>
          </View>

          <View style={styles.form}>
            {/* MERK MOBIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Merk Mobil</Text>
              <TextInput
                style={[
                  styles.input,
                  showErrors && !carData.brand.trim() && styles.inputError,
                ]}
                placeholder="Pilih atau ketik merk..."
                placeholderTextColor={Colors.textMuted}
                value={carData.brand}
                onFocus={() => setBrandSuggestions(Object.keys(CAR_DATABASE))}
                onBlur={() => setTimeout(() => setBrandSuggestions([]), 250)}
                onChangeText={(text) => {
                  handleChange("brand", text);
                  const filtered = Object.keys(CAR_DATABASE).filter((b) =>
                    b.toLowerCase().startsWith(text.toLowerCase()),
                  );
                  setBrandSuggestions(
                    text.length > 0 ? filtered : Object.keys(CAR_DATABASE),
                  );
                }}
              />
              {showErrors && !carData.brand.trim() && (
                <Text style={styles.errorText}>* Merk mobil wajib diisi</Text>
              )}

              {brandSuggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                  {brandSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.suggestionItem}
                      onPress={() => {
                        handleChange("brand", item);
                        setBrandSuggestions([]);
                      }}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* TIPE MOBIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipe/Model</Text>
              <TextInput
                style={[
                  styles.input,
                  showErrors && !carData.type.trim() && styles.inputError,
                ]}
                placeholder="Pilih atau ketik tipe..."
                placeholderTextColor={Colors.textMuted}
                value={carData.type}
                editable={!!carData.brand}
                onFocus={() => {
                  if (carData.brand)
                    setModelSuggestions(CAR_DATABASE[carData.brand] || []);
                }}
                onBlur={() => setTimeout(() => setModelSuggestions([]), 250)}
                onChangeText={(text) => {
                  handleChange("type", text);
                  const models = CAR_DATABASE[carData.brand] || [];
                  const filtered = models.filter((m) =>
                    m.toLowerCase().startsWith(text.toLowerCase()),
                  );
                  setModelSuggestions(text.length > 0 ? filtered : models);
                }}
              />
              {showErrors && !carData.type.trim() && (
                <Text style={styles.errorText}>* Tipe/Model wajib diisi</Text>
              )}

              {modelSuggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                  {modelSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.suggestionItem}
                      onPress={() => {
                        handleChange("type", item);
                        setModelSuggestions([]);
                      }}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* TAHUN & WARNA */}
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.label}>Tahun</Text>
                <TextInput
                  style={[
                    styles.input,
                    showErrors && !carData.year.trim() && styles.inputError,
                  ]}
                  placeholder="2024"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={carData.year}
                  onChangeText={(t) =>
                    handleChange("year", t.replace(/\D/g, ""))
                  }
                />
                {showErrors && !carData.year.trim() && (
                  <Text style={styles.errorText}>* Wajib diisi</Text>
                )}
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.label}>Warna</Text>
                <TextInput
                  style={[
                    styles.input,
                    showErrors && !carData.color.trim() && styles.inputError,
                  ]}
                  placeholder="Contoh: Hitam"
                  placeholderTextColor={Colors.textMuted}
                  value={carData.color}
                  onChangeText={(t) => handleChange("color", t)}
                />
                {showErrors && !carData.color.trim() && (
                  <Text style={styles.errorText}>* Wajib diisi</Text>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Transmisi</Text>
              <View style={styles.transmissionContainer}>
                {TRANSMISSION_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.transBtn,
                      carData.transmission === opt.value &&
                        styles.transBtnActive,
                    ]}
                    onPress={() => handleChange("transmission", opt.value)}
                  >
                    <Text
                      style={[
                        styles.transText,
                        carData.transmission === opt.value &&
                          styles.transTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kilometer</Text>
              <TextInput
                style={[
                  styles.input,
                  showErrors && !carData.mileage.trim() && styles.inputError,
                ]}
                placeholder="10.000"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                value={carData.mileage}
                onChangeText={(t) =>
                  handleChange(
                    "mileage",
                    t.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                  )
                }
              />
              {showErrors && !carData.mileage.trim() && (
                <Text style={styles.errorText}>* Kilometer wajib diisi</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor Polisi</Text>
              <TextInput
                style={[
                  styles.input,
                  showErrors &&
                    !carData.plateNumber.trim() &&
                    styles.inputError,
                ]}
                placeholder="B 1234 ABC"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="characters"
                value={carData.plateNumber}
                onChangeText={(t) =>
                  handleChange("plateNumber", t.toUpperCase())
                }
              />
              {showErrors && !carData.plateNumber.trim() && (
                <Text style={styles.errorText}>* Nomor polisi wajib diisi</Text>
              )}
            </View>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueText}>Lanjutkan</Text>
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
    padding: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontFamily: "PoppinsBold", color: Colors.text },
  content: { flex: 1, paddingHorizontal: 20 },
  iconContainer: { alignItems: "center", marginVertical: 20 },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 20, fontFamily: "PoppinsBold", color: Colors.text },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontFamily: "PoppinsSemiBold", color: Colors.text },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontFamily: "PoppinsMedium",
  },
  // Style baru untuk kotak yang error (merah)
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  // Style baru untuk tulisan error merah di bawah kolom
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    marginTop: -2,
    marginLeft: 4,
  },
  row: { flexDirection: "row", gap: 12 },
  transmissionContainer: { flexDirection: "row", gap: 10 },
  transBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  transBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  transText: { fontSize: 14, fontFamily: "PoppinsMedium", color: Colors.text },
  transTextActive: { color: "white", fontFamily: "PoppinsBold" },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  continueText: { color: "white", fontSize: 16, fontFamily: "PoppinsBold" },
  suggestionBox: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    elevation: 5,
    zIndex: 9999,
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    fontFamily: "PoppinsMedium",
    fontSize: 14,
    color: Colors.text,
  },
});
