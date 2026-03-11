import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState, useEffect } from "react";
import {
  Inspection,
  InspectionMode,
  CarData,
  SellerTransparency,
  ChecklistCategory,
  CategoryScore,
  InspectionResult,
  SCORE_VALUES,
} from "@/types/inspection";
import { DEFAULT_CHECKLIST } from "@/constants/checklist";

const STORAGE_KEY = "carify_inspections";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function deepCopyChecklist(): ChecklistCategory[] {
  return JSON.parse(JSON.stringify(DEFAULT_CHECKLIST));
}

export const [InspectionProvider, useInspection] = createContextHook(() => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load awal data dari storage
  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setInspections(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading inspections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInspections = useCallback(async (newInspections: Inspection[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newInspections));
      setInspections(newInspections);
    } catch (error) {
      console.error("Error saving inspections:", error);
    }
  }, []);

  // FUNGSI AUTO-SAVE: Menyimpan tanpa mengubah status jadi completed
  const saveDraft = useCallback(async (updatedInspection: Inspection) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let currentList: Inspection[] = stored ? JSON.parse(stored) : [];

      const existingIndex = currentList.findIndex(
        (i) => i.id === updatedInspection.id,
      );

      if (existingIndex !== -1) {
        currentList[existingIndex] = updatedInspection;
      } else {
        currentList = [updatedInspection, ...currentList];
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
      setInspections(currentList);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, []);

  const createInspection = useCallback(
    async (mode: InspectionMode) => {
      // Paksa reset data lama agar tidak bocor ke data baru
      setCurrentInspection(null);

      const newInspection: Inspection = {
        id: generateId(),
        mode,
        carData: {
          brand: "",
          type: "",
          year: "",
          color: "",
          transmission: "manual",
          mileage: "",
          plateNumber: "",
        },
        categories: deepCopyChecklist(),
        sellerTransparency: {
          hasAccident: false,
          hasFlood: false,
          regularService: false,
          taxActive: false,
          readyForWorkshopCheck: false,
        },
        status: "draft",
        createdAt: new Date().toISOString(),
      };

      setCurrentInspection(newInspection);
      await saveDraft(newInspection);
      return newInspection;
    },
    [saveDraft],
  );

  const updateCarData = useCallback(
    async (carData: CarData) => {
      let updated: Inspection | null = null;

      setCurrentInspection((prev) => {
        if (!prev) return null;
        updated = { ...prev, carData };
        return updated;
      });

      if (updated) await saveDraft(updated);
    },
    [saveDraft],
  );

  const updateSellerTransparency = useCallback(
    async (sellerTransparency: SellerTransparency) => {
      let updated: Inspection | null = null;

      setCurrentInspection((prev) => {
        if (!prev) return null;
        updated = { ...prev, sellerTransparency };
        return updated;
      });

      // Tunggu sampai data benar-benar tersimpan ke storage
      if (updated) await saveDraft(updated);
    },
    [saveDraft],
  );

  const updateChecklistItem = useCallback(
    async (
      categoryId: string,
      itemId: string,
      updates: Partial<Inspection["categories"][0]["items"][0]>,
    ) => {
      let updated: Inspection | null = null;

      setCurrentInspection((prev) => {
        if (!prev) return null;

        const newCategories = prev.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            items: cat.items.map((item) => {
              if (item.id !== itemId) return item;
              return { ...item, ...updates };
            }),
          };
        });

        updated = { ...prev, categories: newCategories };
        return updated;
      });

      if (updated) await saveDraft(updated);
    },
    [saveDraft],
  );

  const calculateResult = useCallback(
    (inspection: Inspection): InspectionResult => {
      const categoryScores: CategoryScore[] = [];
      const criticalIssues: string[] = [];

      inspection.categories.forEach((category) => {
        let score = 0;
        let maxScore = category.items.length * 2;

        category.items.forEach((item) => {
          const itemScore = SCORE_VALUES[item.answer || "no"];
          score += itemScore;
          if (item.riskIndicator === "critical" && item.answer === "no") {
            criticalIssues.push(item.question);
          }
        });

        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
        const weightedScore = percentage * category.weight;

        categoryScores.push({
          categoryId: category.id,
          categoryName: category.name,
          weight: category.weight,
          score,
          maxScore,
          percentage,
          weightedScore,
        });
      });

      const totalScore = categoryScores.reduce(
        (sum, cat) => sum + cat.weightedScore,
        0,
      );
      const percentage = totalScore;

      let status: InspectionResult["status"];
      if (percentage >= 85) status = "recommended";
      else if (percentage >= 70) status = "consider";
      else if (percentage >= 50) status = "negotiate";
      else status = "not_recommended";

      return {
        inspectionId: inspection.id,
        totalScore,
        maxPossibleScore: 100,
        percentage,
        status,
        hasCriticalIssue: criticalIssues.length > 0,
        categoryScores,
        criticalIssues,
      };
    },
    [],
  );

  const saveInspection = useCallback(async () => {
    if (!currentInspection) return null;

    const completedInspection: Inspection = {
      ...currentInspection,
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    const existingIndex = inspections.findIndex(
      (i) => i.id === completedInspection.id,
    );
    let newInspections: Inspection[];

    if (existingIndex !== -1) {
      newInspections = inspections.map((item) =>
        item.id === completedInspection.id ? completedInspection : item,
      );
    } else {
      newInspections = [completedInspection, ...inspections];
    }

    await saveInspections(newInspections);
    setCurrentInspection(completedInspection);
    return completedInspection;
  }, [currentInspection, inspections, saveInspections]);

  // ---> INI BAGIAN YANG DIPERBAIKI <---
  const deleteInspection = useCallback(
    async (id: string) => {
      try {
        // 1. Ambil data terbaru langsung dari storage (menghindari stale state saat di-loop)
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const currentList: Inspection[] = stored ? JSON.parse(stored) : [];

        // 2. Filter data untuk membuang ID yang dihapus
        const newInspections = currentList.filter((i) => i.id !== id);

        // 3. Simpan dan update state
        await saveInspections(newInspections);
      } catch (error) {
        console.error("Error deleting inspection:", error);
      }
    },
    [saveInspections], // State 'inspections' dihapus dari dependensi agar tidak bocor
  );

  const deleteAllInspections = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setInspections([]);
  }, []);

  const getInspectionById = useCallback(
    (id: string) => inspections.find((i) => i.id === id) || null,
    [inspections],
  );

  const setInspectionById = useCallback(
    (id: string) => {
      const inspection = inspections.find((i) => i.id === id) || null;
      setCurrentInspection(
        inspection ? JSON.parse(JSON.stringify(inspection)) : null,
      );
      return inspection;
    },
    [inspections],
  );

  const clearCurrentInspection = useCallback(() => {
    setCurrentInspection(null);
  }, []);

  return {
    inspections,
    currentInspection,
    isLoading,
    createInspection,
    updateCarData,
    updateSellerTransparency,
    updateChecklistItem,
    saveInspection,
    saveDraft,
    deleteInspection,
    deleteAllInspections,
    getInspectionById,
    setInspectionById,
    clearCurrentInspection,
    calculateResult,
    isCarDataComplete: (carData: CarData) =>
      !!(
        carData.brand &&
        carData.type &&
        carData.year &&
        carData.color &&
        carData.mileage &&
        carData.plateNumber
      ),
  };
});
