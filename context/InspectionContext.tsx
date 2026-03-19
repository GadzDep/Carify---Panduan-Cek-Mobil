import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState, useEffect, useRef } from "react";
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

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Jangkar penyimpan state terbaru tanpa memicu render ulang layar
  const inspectionsRef = useRef(inspections);
  useEffect(() => {
    inspectionsRef.current = inspections;
  }, [inspections]);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Inspection[] = JSON.parse(stored);
        
        const cleanInspections = parsed.filter(
          (i) => i.status === "completed" || i.carData.brand !== "" || i.carData.plateNumber !== ""
        );

        setInspections(cleanInspections);

        if (cleanInspections.length !== parsed.length) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cleanInspections));
        }
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

  // Engine Auto-Save: Menyimpan otomatis 1 detik setelah berhenti klik/ketik
  useEffect(() => {
    // FIX BUG: Hanya auto-save jika status draft DAN ada data mobil (brand/plat tidak kosong)
    if (
      currentInspection && 
      currentInspection.status === "draft" && 
      (currentInspection.carData.brand.trim() !== "" || currentInspection.carData.plateNumber.trim() !== "")
    ) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        setInspections((prevList) => {
          const existingIndex = prevList.findIndex(
            (i) => i.id === currentInspection.id,
          );

          let newList: Inspection[];
          if (existingIndex !== -1) {
            newList = [...prevList];
            newList[existingIndex] = currentInspection;
          } else {
            newList = [currentInspection, ...prevList];
          }

          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(
            (err) => console.error("Error saving draft:", err)
          );

          return newList;
        });
      }, 1000); 
    }
  }, [currentInspection]);

  const saveDraft = useCallback(async (updatedInspection: Inspection) => {
    const currentList = inspectionsRef.current;
    const existingIndex = currentList.findIndex((i) => i.id === updatedInspection.id);
    let newList = [...currentList];
    
    if (existingIndex !== -1) {
      newList[existingIndex] = updatedInspection;
    } else {
      newList = [updatedInspection, ...newList];
    }
    
    setInspections(newList);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  }, []);

  const createInspection = useCallback(
    async (mode: InspectionMode) => {
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
      return newInspection;
    },
    [],
  );

  const updateCarData = useCallback((carData: CarData) => {
    setCurrentInspection((prev) => {
      if (!prev) return null;
      return { ...prev, carData };
    });
  }, []);

  const updateSellerTransparency = useCallback(
    (sellerTransparency: SellerTransparency) => {
      setCurrentInspection((prev) => {
        if (!prev) return null;
        return { ...prev, sellerTransparency };
      });
    },
    [],
  );

  const updateChecklistItem = useCallback(
    (
      categoryId: string,
      itemId: string,
      updates: Partial<Inspection["categories"][0]["items"][0]>,
    ) => {
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

        return { ...prev, categories: newCategories };
      });
    },
    [],
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
    setCurrentInspection(null); 
    return completedInspection;
  }, [currentInspection, inspections, saveInspections]);

  const deleteInspection = useCallback(
    async (id: string) => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const currentList: Inspection[] = stored ? JSON.parse(stored) : [];

        const newInspections = currentList.filter((i) => i.id !== id);

        await saveInspections(newInspections);
      } catch (error) {
        console.error("Error deleting inspection:", error);
      }
    },
    [saveInspections],
  );

  const deleteAllInspections = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setInspections([]);
  }, []);

  const getInspectionById = useCallback(
    (id: string) => inspectionsRef.current.find((i) => i.id === id) || null,
    [],
  );

  const setInspectionById = useCallback(
    (id: string) => {
      const inspection = inspectionsRef.current.find((i) => i.id === id) || null;
      setCurrentInspection(
        inspection ? JSON.parse(JSON.stringify(inspection)) : null,
      );
      return inspection;
    },
    [],
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